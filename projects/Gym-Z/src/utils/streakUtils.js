// Membership Streak logic: NOT attendance-based. A streak is the count of
// continuous, on-time renewals. If a member lets their membership stay
// expired beyond the grace period (default 30 days), the streak resets to
// zero on their next renewal.
import { daysUntil } from './dateUtils.js'

export const DEFAULT_GRACE_PERIOD_DAYS = 30

/**
 * Call this when processing a renewal to compute the member's new streak.
 * `previousExpiryDate` is the expiry date before this renewal was applied.
 */
export function computeNextStreak(previousExpiryDate, currentStreakCount, gracePeriodDays = DEFAULT_GRACE_PERIOD_DAYS) {
  const daysSinceExpiry = -daysUntil(previousExpiryDate) // positive if already expired
  const brokeStreak = daysSinceExpiry > gracePeriodDays
  const nextCount = brokeStreak ? 1 : (currentStreakCount || 0) + 1
  return { count: nextCount, broke: brokeStreak }
}

/** Formats a raw renewal count into a friendly streak label, e.g. "8 Month Streak". */
export function formatStreak(count) {
  if (!count || count < 1) return null
  if (count < 12) return `${count} Month${count > 1 ? 's' : ''} Streak`
  const years = Math.floor(count / 12)
  const months = count % 12
  if (months === 0) return `${years} Year${years > 1 ? 's' : ''} Streak`
  return `${years}y ${months}m Streak`
}
