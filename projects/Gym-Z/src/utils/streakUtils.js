// Loyalty Streak logic: represents TOTAL CONTINUOUS MEMBERSHIP DURATION
// (paid-for days), not attendance. A streak only becomes visible once the
// member has renewed at least once AND accumulated 30+ continuous days.
// Any gap between coverage end and the next renewal's start that exceeds
// the configured grace period resets the streak completely.
import { diffDays } from "./dateUtils.js";

export const DEFAULT_GRACE_PERIOD_DAYS = 30;
export const STREAK_QUALIFYING_DAYS = 30;

/**
 * Call this on every renewal (expired-renew, extend, or start-immediately).
 * `previousCoverageEndDate` is the expiry date of the member's current (or
 * latest scheduled) membership BEFORE this renewal is applied.
 * `streakStartDate` is the member's existing streak anchor (may be null).
 * `streakAnchorDate` is a fallback anchor (the member's original joiningDate)
 * used only the very first time a streak is computed.
 */
export function computeStreakOnRenewal({
  previousCoverageEndDate,
  newStartDate,
  newExpiryDate,
  streakStartDate,
  streakAnchorDate,
  gracePeriodDays = DEFAULT_GRACE_PERIOD_DAYS,
}) {
  const gapDays = previousCoverageEndDate
    ? diffDays(previousCoverageEndDate, newStartDate)
    : null;
  const isContinuous = gapDays === null ? true : gapDays <= gracePeriodDays;

  const nextStreakStartDate = isContinuous
    ? streakStartDate || streakAnchorDate || newStartDate
    : newStartDate;

  const streakDays = Math.max(diffDays(nextStreakStartDate, newExpiryDate), 0);

  return {
    streakStartDate: nextStreakStartDate,
    streakDays,
    broke: !isContinuous,
  };
}

/**
 * Formats streak days into a display label, or null if not yet qualifying
 * (caller should show "New Member" when this returns null).
 */
export function formatStreak(streakDays) {
  if (!streakDays || streakDays < STREAK_QUALIFYING_DAYS) return null;
  if (streakDays < 365)
    return `${streakDays} Day${streakDays === 1 ? "" : "s"}`;

  const years = Math.floor(streakDays / 365);
  const months = Math.floor((streakDays % 365) / 30);
  if (months === 0) return `${years} Year${years > 1 ? "s" : ""}`;
  return `${years} Year${years > 1 ? "s" : ""} ${months} Month${months > 1 ? "s" : ""}`;
}
