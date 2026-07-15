// Firestore data-access layer. Every gym's data is scoped under
// gyms/{gymId}/... subcollections, which is what makes each gym's
// workspace private: security rules only allow a gym's own auth uid to
// read/write inside its own gyms/{gymId} document tree (see firestore.rules
// in the project root for the enforced version of this contract).
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "./config.js";

// ---------- Gyms ----------

export async function createGymDoc(uid, gymData) {
  const ref = doc(collection(db, "gyms"));
  await setDoc(ref, {
    ...gymData,
    ownerUid: uid,
    createdAt: serverTimestamp(),
  });
  await setDoc(
    doc(db, "users", uid),
    { gymIds: arrayUnion(ref.id) },
    { merge: true },
  );
  return ref;
}

export async function getGym(gymId) {
  const snap = await getDoc(doc(db, "gyms", gymId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateGym(gymId, data) {
  await updateDoc(doc(db, "gyms", gymId), data);
}

export async function getOwnerPrimaryGym(ownerUid) {
  const ownedGymsQuery = query(
    collection(db, "gyms"),
    where("ownerUid", "==", ownerUid),
    limit(1),
  );
  const ownedGymsSnap = await getDocs(ownedGymsQuery);
  if (!ownedGymsSnap.empty) {
    const gymDoc = ownedGymsSnap.docs[0];
    return { id: gymDoc.id, ...gymDoc.data() };
  }

  const fallbackSnap = await getDoc(doc(db, "gyms", ownerUid));
  return fallbackSnap.exists()
    ? { id: fallbackSnap.id, ...fallbackSnap.data() }
    : null;
}

export async function listOwnerGyms(ownerUid) {
  const ownedGymsQuery = query(
    collection(db, "gyms"),
    where("ownerUid", "==", ownerUid),
  );
  const ownedGymsSnap = await getDocs(ownedGymsQuery);
  if (!ownedGymsSnap.empty) {
    return ownedGymsSnap.docs.map((gymDoc) => ({
      id: gymDoc.id,
      ...gymDoc.data(),
    }));
  }

  const fallbackSnap = await getDoc(doc(db, "gyms", ownerUid));
  return fallbackSnap.exists()
    ? [{ id: fallbackSnap.id, ...fallbackSnap.data() }]
    : [];
}

export async function deleteGym(gymId, ownerUid) {
  await deleteDoc(doc(db, "gyms", gymId));
  await updateDoc(doc(db, "users", ownerUid), { gymIds: arrayRemove(gymId) });
}

/** Public, unauthenticated read for the Gym Rankings page. */
export async function listRankedGyms() {
  const q = query(
    collection(db, "gyms"),
    orderBy("activeMemberCount", "desc"),
    limit(100),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ---------- Membership Plans ----------

export function plansCollection(gymId) {
  return collection(db, "gyms", gymId, "membershipPlans");
}

export async function addPlan(gymId, plan) {
  return addDoc(plansCollection(gymId), {
    ...plan,
    createdAt: serverTimestamp(),
  });
}

export async function updatePlan(gymId, planId, data) {
  await updateDoc(doc(db, "gyms", gymId, "membershipPlans", planId), data);
}

export async function deletePlan(gymId, planId) {
  await deleteDoc(doc(db, "gyms", gymId, "membershipPlans", planId));
}

export function subscribeToPlans(gymId, callback) {
  return onSnapshot(
    query(plansCollection(gymId), orderBy("durationDays", "asc")),
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    },
  );
}

// ---------- Members ----------

export function membersCollection(gymId) {
  return collection(db, "gyms", gymId, "members");
}

/** Duplicate detection: phone number is the unique identifier per gym. */
export async function findMemberByPhone(gymId, phone) {
  const q = query(
    membersCollection(gymId),
    where("phone", "==", phone),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
}

export async function addMember(gymId, memberData) {
  const ref = await addDoc(membersCollection(gymId), {
    ...memberData,
    lifetimeAmountPaid: memberData.membershipFee || 0,
    streakCount: 1,
    streakUnit: "month",
    status: "active",
    createdAt: serverTimestamp(),
  });
  // First payment also becomes the first renewal history entry
  await addDoc(collection(db, "gyms", gymId, "members", ref.id, "renewals"), {
    type: "new",
    planName: memberData.planName,
    amount: memberData.membershipFee,
    startDate: memberData.joiningDate,
    expiryDate: memberData.expiryDate,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "gyms", gymId), { activeMemberCount: increment(1) });
  return ref;
}

export async function renewMembership(gymId, memberId, renewalData) {
  const batch = writeBatch(db);
  const memberRef = doc(db, "gyms", gymId, "members", memberId);
  const renewalRef = doc(
    collection(db, "gyms", gymId, "members", memberId, "renewals"),
  );

  batch.set(renewalRef, {
    type: "renewal",
    planName: renewalData.planName,
    amount: renewalData.membershipFee,
    startDate: renewalData.startDate,
    expiryDate: renewalData.expiryDate,
    createdAt: serverTimestamp(),
  });
  batch.update(memberRef, {
    planName: renewalData.planName,
    membershipFee: renewalData.membershipFee,
    joiningDate: renewalData.startDate,
    expiryDate: renewalData.expiryDate,
    status: "active",
    lifetimeAmountPaid: increment(renewalData.membershipFee || 0),
    streakCount: renewalData.newStreakCount,
    streakUnit: renewalData.newStreakUnit,
  });
  await batch.commit();
}

export async function updateMember(gymId, memberId, data) {
  await updateDoc(doc(db, "gyms", gymId, "members", memberId), data);
}

export async function getMember(gymId, memberId) {
  const snap = await getDoc(doc(db, "gyms", gymId, "members", memberId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export function subscribeToMembers(gymId, callback) {
  return onSnapshot(
    query(membersCollection(gymId), orderBy("expiryDate", "asc")),
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    },
  );
}

export async function getMemberRenewals(gymId, memberId) {
  const snap = await getDocs(
    query(
      collection(db, "gyms", gymId, "members", memberId, "renewals"),
      orderBy("createdAt", "desc"),
    ),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ---------- Blacklist ----------

export function blacklistCollection(gymId) {
  return collection(db, "gyms", gymId, "blacklist");
}

export async function addToBlacklist(gymId, memberId, entry) {
  await addDoc(blacklistCollection(gymId), {
    memberId,
    reason: entry.reason,
    notes: entry.notes || "",
    dateAdded: serverTimestamp(),
  });
  await updateDoc(doc(db, "gyms", gymId, "members", memberId), {
    blacklisted: true,
  });
}

export async function removeFromBlacklist(gymId, blacklistEntryId, memberId) {
  await deleteDoc(doc(db, "gyms", gymId, "blacklist", blacklistEntryId));
  await updateDoc(doc(db, "gyms", gymId, "members", memberId), {
    blacklisted: false,
  });
}

export function subscribeToBlacklist(gymId, callback) {
  return onSnapshot(
    query(blacklistCollection(gymId), orderBy("dateAdded", "desc")),
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    },
  );
}
