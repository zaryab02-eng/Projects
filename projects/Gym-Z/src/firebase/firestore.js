// Firestore data-access layer. Every gym's data is scoped under
// gyms/{gymId}/... subcollections, which is what makes each gym's
// workspace private: security rules only allow a gym's own auth uid to
// read/write inside its own gyms/{gymId} document tree (see firestore.rules
// in the project root for the enforced version of this contract).
//
// OFFLINE: Firestore's persistent cache (config.js) queues writes made
// offline. A write promise only resolves once the SERVER confirms, so
// awaiting it offline would hang the UI forever. Every write therefore
// goes through commit(), which returns immediately when offline (or if
// the server is slow) while the write stays queued and syncs later.
import {
  collection,
  doc,
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
  deleteField,
} from "firebase/firestore";
import { db } from "./config.js";
import { addDays, todayStr, daysUntil } from "../utils/dateUtils.js";

const SYNC_WAIT_MS = 4000;

// Each member has at most two documents, stored under fixed ids so they can
// be replaced/deleted without reading them (they are large).
export const DOCUMENT_SLOT_IDS = ["slot1", "slot2"];

/** Waits for a write to reach the server only while online and fast.
 * Offline / slow network: resolves right away; the write stays queued in
 * the local cache and syncs automatically later. Real errors (e.g.
 * permission denied) that arrive while waiting still throw. */
async function commit(promise) {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    promise.catch((error) => console.warn("Queued write failed:", error));
    return;
  }
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(resolve, SYNC_WAIT_MS);
  });
  try {
    await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

// ---------- Gyms ----------

export async function createGymDoc(uid, gymData) {
  const ref = doc(collection(db, "gyms"));
  await commit(
    setDoc(ref, {
      ...gymData,
      ownerUid: uid,
      createdAt: serverTimestamp(),
    }),
  );
  await commit(
    setDoc(
      doc(db, "users", uid),
      { gymIds: arrayUnion(ref.id) },
      { merge: true },
    ),
  );
  return ref;
}

export async function getGym(gymId) {
  const snap = await getDoc(doc(db, "gyms", gymId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateGym(gymId, data) {
  await commit(updateDoc(doc(db, "gyms", gymId), data));
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

/** Deletes refs in batches (Firestore allows 500 operations per batch). */
async function deleteInChunks(refs) {
  for (let i = 0; i < refs.length; i += 400) {
    const batch = writeBatch(db);
    refs.slice(i, i + 400).forEach((ref) => batch.delete(ref));
    await commit(batch.commit());
  }
}

/** Deletes the gym AND everything under it (members with their renewals,
 * freezes and documents, plans, blacklist). Firestore never cascades, so
 * children go first; the gym document goes last because security rules
 * check ownership through it. */
export async function deleteGym(gymId, ownerUid) {
  const refs = [];

  const membersSnap = await getDocs(membersCollection(gymId));
  for (const memberDoc of membersSnap.docs) {
    const [renewalsSnap, freezesSnap] = await Promise.all([
      getDocs(collection(memberDoc.ref, "renewals")),
      getDocs(collection(memberDoc.ref, "freezes")),
    ]);
    renewalsSnap.docs.forEach((d) => refs.push(d.ref));
    freezesSnap.docs.forEach((d) => refs.push(d.ref));
    DOCUMENT_SLOT_IDS.forEach((slotId) =>
      refs.push(doc(memberDoc.ref, "documents", slotId)),
    );
    refs.push(memberDoc.ref);
  }

  const [plansSnap, blacklistSnap] = await Promise.all([
    getDocs(plansCollection(gymId)),
    getDocs(blacklistCollection(gymId)),
  ]);
  plansSnap.docs.forEach((d) => refs.push(d.ref));
  blacklistSnap.docs.forEach((d) => refs.push(d.ref));

  await deleteInChunks(refs);
  await commit(deleteDoc(doc(db, "gyms", gymId)));
  await commit(
    updateDoc(doc(db, "users", ownerUid), { gymIds: arrayRemove(gymId) }),
  );
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
  const ref = doc(plansCollection(gymId));
  await commit(
    setDoc(ref, {
      ...plan,
      createdAt: serverTimestamp(),
    }),
  );
  return ref;
}

export async function updatePlan(gymId, planId, data) {
  await commit(
    updateDoc(doc(db, "gyms", gymId, "membershipPlans", planId), data),
  );
}

export async function deletePlan(gymId, planId) {
  await commit(deleteDoc(doc(db, "gyms", gymId, "membershipPlans", planId)));
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

/** Duplicate detection: phone number is the unique identifier per gym.
 * Works offline too (reads the local cache, including pending adds). */
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

/** `documents` (optional) is a list of { id: "slot1"|"slot2", label,
 * imageData }, written in the same batch as the member. */
export async function addMember(gymId, memberData, documents = []) {
  const batch = writeBatch(db);
  const memberRef = doc(membersCollection(gymId));
  const renewalRef = doc(
    collection(db, "gyms", gymId, "members", memberRef.id, "renewals"),
  );

  batch.set(memberRef, {
    ...memberData,
    lifetimeAmountPaid: memberData.membershipFee || 0,
    scheduledMembership: null,
    status: "active",
    createdAt: serverTimestamp(),
  });
  // First payment also becomes the first renewal history entry
  batch.set(renewalRef, {
    type: "new",
    planName: memberData.planName,
    amount: memberData.membershipFee,
    startDate: memberData.joiningDate,
    expiryDate: memberData.expiryDate,
    createdAt: serverTimestamp(),
  });
  documents
    .filter((d) => DOCUMENT_SLOT_IDS.includes(d.id) && d.imageData)
    .forEach((d) => {
      batch.set(doc(memberRef, "documents", d.id), {
        label: d.label || "",
        imageData: d.imageData,
        createdAt: serverTimestamp(),
      });
    });
  batch.update(doc(db, "gyms", gymId), { activeMemberCount: increment(1) });

  await commit(batch.commit());
  return memberRef;
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
 * Frozen members are never promoted (their dates only move on unfreeze).
 */
function computeScheduledPromotion(member) {
  if (!member?.scheduledMembership) return null;
  if (member.frozen) return null;
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
 * idempotent. Returns the raw write promise. */
function persistScheduledPromotion(gymId, memberId, updates) {
  return updateDoc(doc(db, "gyms", gymId, "members", memberId), updates);
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

  await commit(persistScheduledPromotion(gymId, memberId, promotion));
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

function assertNotFrozen(member) {
  if (member?.frozen) {
    throw new Error("This member is frozen. Unfreeze the membership first.");
  }
}

/** Shared write path for every renewal type: writes a history record,
 * updates lifetime paid, and either updates the current membership
 * fields directly or queues a scheduledMembership. */
async function writeRenewal(
  gymId,
  memberId,
  { planName, membershipFee, startDate, expiryDate },
  { schedule },
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

  const updates = {
    lifetimeAmountPaid: increment(membershipFee || 0),
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
  await commit(batch.commit());
}

/** Membership had already expired: new plan always starts today. */
export async function renewExpiredMembership(gymId, memberId, member, plan) {
  assertNotFrozen(member);
  const startDate = todayStr();
  const expiryDate = addDays(startDate, plan.durationDays);
  await writeRenewal(
    gymId,
    memberId,
    { planName: plan.name, membershipFee: plan.fee, startDate, expiryDate },
    { schedule: false },
  );
}

/** Membership still active — "Extend" option: queues the new plan to begin
 * the day after current coverage ends (chaining off any already-scheduled
 * membership so nothing overlaps). Lifetime paid increases immediately. */
export async function extendMembership(gymId, memberId, member, plan) {
  assertNotFrozen(member);
  const baseEnd = coverageEnd(member);
  const startDate = addDays(baseEnd, 1);
  const expiryDate = addDays(startDate, plan.durationDays);
  await writeRenewal(
    gymId,
    memberId,
    { planName: plan.name, membershipFee: plan.fee, startDate, expiryDate },
    { schedule: true },
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
) {
  assertNotFrozen(member);
  const startDate = todayStr();
  const expiryDate = addDays(startDate, plan.durationDays);
  await writeRenewal(
    gymId,
    memberId,
    { planName: plan.name, membershipFee: plan.fee, startDate, expiryDate },
    { schedule: false },
  );
}

export async function updateMember(gymId, memberId, data) {
  await commit(updateDoc(doc(db, "gyms", gymId, "members", memberId), data));
}

/** Sets or removes (null/empty) the member's profile photo. */
export async function setMemberPhoto(gymId, memberId, photoUrl) {
  await commit(
    updateDoc(doc(db, "gyms", gymId, "members", memberId), {
      photoUrl: photoUrl || deleteField(),
    }),
  );
}

export async function getMemberRenewals(gymId, memberId) {
  const snap = await getDocs(
    collection(db, "gyms", gymId, "members", memberId, "renewals"),
  );
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Newest first. Renewals written offline have no server timestamp yet
  // (createdAt is null), so they are treated as newest.
  const millis = (r) =>
    typeof r.createdAt?.toMillis === "function"
      ? r.createdAt.toMillis()
      : Number.MAX_SAFE_INTEGER;
  return rows.sort((a, b) => millis(b) - millis(a));
}

export async function deleteMember(gymId, memberId) {
  const batch = writeBatch(db);
  const memberRef = doc(db, "gyms", gymId, "members", memberId);

  const [renewalsSnap, freezesSnap] = await Promise.all([
    getDocs(collection(db, "gyms", gymId, "members", memberId, "renewals")),
    getDocs(collection(db, "gyms", gymId, "members", memberId, "freezes")),
  ]);
  renewalsSnap.docs.forEach((d) => batch.delete(d.ref));
  freezesSnap.docs.forEach((d) => batch.delete(d.ref));

  // Fixed ids: deleted without reading the (large) documents.
  DOCUMENT_SLOT_IDS.forEach((slotId) =>
    batch.delete(doc(memberRef, "documents", slotId)),
  );

  const blacklistSnap = await getDocs(
    query(blacklistCollection(gymId), where("memberId", "==", memberId)),
  );
  blacklistSnap.docs.forEach((blacklistDoc) => batch.delete(blacklistDoc.ref));

  batch.delete(memberRef);
  batch.update(doc(db, "gyms", gymId), { activeMemberCount: increment(-1) });
  await commit(batch.commit());
}

// ---------- Member documents (loaded only on the Member Profile) ----------

function documentsCollection(gymId, memberId) {
  return collection(db, "gyms", gymId, "members", memberId, "documents");
}

/** Live list of a member's documents (max 2). Served from the local cache
 * first, so repeat visits and offline use don't re-download the images. */
export function subscribeToMemberDocuments(gymId, memberId, callback) {
  return onSnapshot(
    documentsCollection(gymId, memberId),
    (snap) => {
      callback(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => a.id.localeCompare(b.id)),
      );
    },
    (error) => console.warn("Documents listener error:", error),
  );
}

/** Creates or replaces one document slot ("slot1" | "slot2"). */
export async function saveMemberDocument(gymId, memberId, slotId, data) {
  if (!DOCUMENT_SLOT_IDS.includes(slotId)) {
    throw new Error("A member can have at most 2 documents.");
  }
  await commit(
    setDoc(doc(db, "gyms", gymId, "members", memberId, "documents", slotId), {
      label: data.label || "",
      imageData: data.imageData,
      createdAt: serverTimestamp(),
    }),
  );
}

export async function deleteMemberDocument(gymId, memberId, slotId) {
  await commit(
    deleteDoc(doc(db, "gyms", gymId, "members", memberId, "documents", slotId)),
  );
}

// ---------- Freeze / Unfreeze ----------

/** Pauses the membership. The expiry date is NOT changed while frozen. */
export async function freezeMember(gymId, memberId, reason = "") {
  await commit(
    updateDoc(doc(db, "gyms", gymId, "members", memberId), {
      frozen: true,
      freezeStartDate: todayStr(),
      freezeReason: reason || "",
    }),
  );
}

/** Resumes the membership: pushes expiry (and any scheduled membership)
 * forward by the days frozen, clears the freeze fields and appends a
 * permanent freeze-history record, all in one batch. Returns days frozen. */
export async function unfreezeMember(gymId, memberId, member) {
  const startDate = member.freezeStartDate || todayStr();
  const endDate = todayStr();
  const daysFrozen = Math.max(0, -daysUntil(startDate));

  const memberRef = doc(db, "gyms", gymId, "members", memberId);
  const batch = writeBatch(db);

  const updates = {
    frozen: false,
    freezeStartDate: deleteField(),
    freezeReason: deleteField(),
    expiryDate: addDays(member.expiryDate, daysFrozen),
  };
  if (member.scheduledMembership) {
    updates.scheduledMembership = {
      ...member.scheduledMembership,
      startDate: addDays(member.scheduledMembership.startDate, daysFrozen),
      expiryDate: addDays(member.scheduledMembership.expiryDate, daysFrozen),
    };
  }
  batch.update(memberRef, updates);

  batch.set(doc(collection(memberRef, "freezes")), {
    startDate,
    endDate,
    daysFrozen,
    reason: member.freezeReason || "",
    createdAt: serverTimestamp(),
  });

  await commit(batch.commit());
  return daysFrozen;
}

export async function getMemberFreezes(gymId, memberId) {
  const snap = await getDocs(
    collection(db, "gyms", gymId, "members", memberId, "freezes"),
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.endDate || "").localeCompare(a.endDate || ""));
}

// ---------- Blacklist ----------

export function blacklistCollection(gymId) {
  return collection(db, "gyms", gymId, "blacklist");
}

export async function addToBlacklist(gymId, memberId, entry) {
  const batch = writeBatch(db);
  batch.set(doc(blacklistCollection(gymId)), {
    memberId,
    reason: entry.reason,
    notes: entry.notes || "",
    dateAdded: serverTimestamp(),
  });
  batch.update(doc(db, "gyms", gymId, "members", memberId), {
    blacklisted: true,
  });
  await commit(batch.commit());
}

/**
 * Un-blacklists a member. Takes just memberId (not a blacklist entry id)
 * so any screen that already has the member — Member Profile included,
 * which never loads blacklist entries itself — can call this directly.
 * Looks up and deletes the matching blacklist entry/entries itself.
 */
export async function removeFromBlacklist(gymId, memberId) {
  const snap = await getDocs(
    query(blacklistCollection(gymId), where("memberId", "==", memberId)),
  );
  const batch = writeBatch(db);
  snap.docs.forEach((entryDoc) => batch.delete(entryDoc.ref));
  batch.update(doc(db, "gyms", gymId, "members", memberId), {
    blacklisted: false,
  });
  await commit(batch.commit());
}

export function subscribeToBlacklist(gymId, callback) {
  return onSnapshot(
    query(blacklistCollection(gymId), orderBy("dateAdded", "desc")),
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    },
  );
}
