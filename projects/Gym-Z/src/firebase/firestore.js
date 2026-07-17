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
import { addDays, todayStr } from "../utils/dateUtils.js";
import {
  computeStreakOnRenewal,
  DEFAULT_GRACE_PERIOD_DAYS,
} from "../utils/streakUtils.js";

// ---------- Gyms ----------

export async function createGymDoc(uid, gymData) {
  const ref = doc(collection(db, "gyms"));
  await setDoc(ref, {
    ...gymData,
    ownerUid: uid,
    gracePeriodDays: DEFAULT_GRACE_PERIOD_DAYS,
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
    scheduledMembership: null,
    // Streak starts at 0 and stays hidden ("New Member") until the first
    // renewal — streakStartDate is set lazily on that first renewal, using
    // this member's original joiningDate as the continuity anchor.
    streakDays: 0,
    streakStartDate: null,
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

/** The end date of whatever the member is currently "paid through" —
 * their scheduled future membership if one exists (from a prior Extend),
 * otherwise their current membership's expiry. */
function coverageEnd(member) {
  return member.scheduledMembership?.expiryDate || member.expiryDate;
}

/**
 * PURE function: given a raw member object, returns whether its scheduled
 * (future-dated) membership from a prior "Extend" renewal is now due, and
 * if so, the field updates that promote it into the current membership.
 * This is the single source of truth for promotion logic — both the
 * single-member read path (getMember) and the live list path
 * (subscribeToMembers) call this, so Dashboard, Members list, and Member
 * Profile can never disagree about whether a membership has activated.
 */
function computeScheduledPromotion(member) {
  if (!member?.scheduledMembership) return null;
  const today = todayStr();
  if (member.scheduledMembership.startDate > today) return null;

  const { planName, startDate, expiryDate, membershipFee } =
    member.scheduledMembership;
  return {
    planName,
    membershipFee,
    joiningDate: startDate,
    expiryDate,
    status: "active",
    scheduledMembership: null,
  };
}

/** Applies a promotion (if due) to Firestore. Safe to call redundantly —
 * it's a plain field overwrite, not an increment, so repeat calls are
 * idempotent. */
async function persistScheduledPromotion(gymId, memberId, updates) {
  await updateDoc(doc(db, "gyms", gymId, "members", memberId), updates);
}

/**
 * Ensures a single member's scheduled membership is activated if due,
 * before returning it. Used by every page that fetches one member
 * (currently Member Profile).
 */
export async function getMember(gymId, memberId) {
  const snap = await getDoc(doc(db, "gyms", gymId, "members", memberId));
  if (!snap.exists()) return null;
  const member = { id: snap.id, ...snap.data() };

  const promotion = computeScheduledPromotion(member);
  if (!promotion) return member;

  await persistScheduledPromotion(gymId, memberId, promotion);
  return { ...member, ...promotion };
}

/**
 * Live member list used by Dashboard and Members. On every snapshot, any
 * member whose scheduled membership start date has arrived is promoted
 * automatically, in the background, before the list reaches the caller —
 * the gym owner never needs to open an individual profile to trigger it.
 * A per-subscription "already persisting" guard avoids firing duplicate
 * writes if onSnapshot re-fires (e.g. reconnect) before the first write
 * for that member has round-tripped back into this same snapshot listener.
 */
export function subscribeToMembers(gymId, callback) {
  const persistingIds = new Set();

  return onSnapshot(
    query(membersCollection(gymId), orderBy("expiryDate", "asc")),
    (snap) => {
      const members = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      members.forEach((member, index) => {
        const promotion = computeScheduledPromotion(member);
        if (!promotion) return;

        // Reflect the promotion immediately in what we hand back, so the
        // UI never shows stale/expired-looking data while the write is
        // in flight.
        members[index] = { ...member, ...promotion };

        if (!persistingIds.has(member.id)) {
          persistingIds.add(member.id);
          persistScheduledPromotion(gymId, member.id, promotion)
            .catch((error) =>
              console.warn("Failed to promote scheduled membership:", error),
            )
            .finally(() => persistingIds.delete(member.id));
        }
      });

      callback(members);
    },
  );
}

/** Shared write path for every renewal type: writes a history record,
 * updates lifetime paid, recomputes the streak, and either updates the
 * current membership fields directly or queues a scheduledMembership. */
async function writeRenewal(
  gymId,
  memberId,
  member,
  { planName, membershipFee, startDate, expiryDate },
  { schedule, gracePeriodDays = DEFAULT_GRACE_PERIOD_DAYS },
) {
  const batch = writeBatch(db);
  const memberRef = doc(db, "gyms", gymId, "members", memberId);
  const renewalRef = doc(
    collection(db, "gyms", gymId, "members", memberId, "renewals"),
  );

  batch.set(renewalRef, {
    type: "renewal",
    planName,
    amount: membershipFee,
    startDate,
    expiryDate,
    createdAt: serverTimestamp(),
  });

  const streak = computeStreakOnRenewal({
    previousCoverageEndDate: coverageEnd(member),
    newStartDate: startDate,
    newExpiryDate: expiryDate,
    streakStartDate: member.streakStartDate,
    streakAnchorDate: member.joiningDate,
    gracePeriodDays,
  });

  const updates = {
    lifetimeAmountPaid: increment(membershipFee || 0),
    streakStartDate: streak.streakStartDate,
    streakDays: streak.streakDays,
    status: "active",
  };

  if (schedule) {
    updates.scheduledMembership = {
      planName,
      membershipFee,
      startDate,
      expiryDate,
    };
  } else {
    updates.planName = planName;
    updates.membershipFee = membershipFee;
    updates.joiningDate = startDate;
    updates.expiryDate = expiryDate;
    updates.scheduledMembership = null;
  }

  batch.update(memberRef, updates);
  await batch.commit();
}

/** Membership had already expired: new plan always starts today. */
export async function renewExpiredMembership(
  gymId,
  memberId,
  member,
  plan,
  gracePeriodDays,
) {
  const startDate = todayStr();
  const expiryDate = addDays(startDate, plan.durationDays);
  await writeRenewal(
    gymId,
    memberId,
    member,
    { planName: plan.name, membershipFee: plan.fee, startDate, expiryDate },
    { schedule: false, gracePeriodDays },
  );
}

/** Membership still active — "Extend" option: queues the new plan to begin
 * the day after current coverage ends (chaining off any already-scheduled
 * membership so nothing overlaps). Lifetime paid increases immediately. */
export async function extendMembership(
  gymId,
  memberId,
  member,
  plan,
  gracePeriodDays,
) {
  const baseEnd = coverageEnd(member);
  const startDate = addDays(baseEnd, 1);
  const expiryDate = addDays(startDate, plan.durationDays);
  await writeRenewal(
    gymId,
    memberId,
    member,
    { planName: plan.name, membershipFee: plan.fee, startDate, expiryDate },
    { schedule: true, gracePeriodDays },
  );
}

/** Membership still active — "Start Immediately" option: cuts the current
 * plan short today, discarding remaining days, and starts the new plan now.
 * Supersedes any previously scheduled (Extend) membership. */
export async function renewMembershipImmediately(
  gymId,
  memberId,
  member,
  plan,
  gracePeriodDays,
) {
  const startDate = todayStr();
  const expiryDate = addDays(startDate, plan.durationDays);
  await writeRenewal(
    gymId,
    memberId,
    member,
    { planName: plan.name, membershipFee: plan.fee, startDate, expiryDate },
    { schedule: false, gracePeriodDays },
  );
}

export async function updateMember(gymId, memberId, data) {
  await updateDoc(doc(db, "gyms", gymId, "members", memberId), data);
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

export async function deleteMember(gymId, memberId) {
  const batch = writeBatch(db);
  const memberRef = doc(db, "gyms", gymId, "members", memberId);

  const renewalsSnap = await getDocs(
    collection(db, "gyms", gymId, "members", memberId, "renewals"),
  );
  renewalsSnap.docs.forEach((renewalDoc) => batch.delete(renewalDoc.ref));

  const blacklistSnap = await getDocs(
    query(blacklistCollection(gymId), where("memberId", "==", memberId)),
  );
  blacklistSnap.docs.forEach((blacklistDoc) => batch.delete(blacklistDoc.ref));

  batch.delete(memberRef);
  await batch.commit();

  await updateDoc(doc(db, "gyms", gymId), { activeMemberCount: increment(-1) });
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
