// Membership status classification + the color gradient for the horizontal
// validity indicator on member cards (dark green -> red -> grey/expired).
import { daysUntil } from './dateUtils.js'

export const URGENCY_BUCKETS = {
  EXPIRED: 'expired',
  EXPIRES_TODAY: 'expires_today',
  EXPIRES_TOMORROW: 'expires_tomorrow',
  WITHIN_3_DAYS: 'within_3_days',
  WITHIN_7_DAYS: 'within_7_days',
  HEALTHY: 'healthy'
}

const BUCKET_LABELS = {
  [URGENCY_BUCKETS.EXPIRED]: 'Expired',
  [URGENCY_BUCKETS.EXPIRES_TODAY]: 'Expires Today',
  [URGENCY_BUCKETS.EXPIRES_TOMORROW]: 'Expires Tomorrow',
  [URGENCY_BUCKETS.WITHIN_3_DAYS]: 'Expires Within 3 Days',
  [URGENCY_BUCKETS.WITHIN_7_DAYS]: 'Expires Within 7 Days',
  [URGENCY_BUCKETS.HEALTHY]: 'Active'
}

export function getUrgencyBucket(expiryDateStr) {
  const diff = daysUntil(expiryDateStr)
  if (diff < 0) return URGENCY_BUCKETS.EXPIRED
  if (diff === 0) return URGENCY_BUCKETS.EXPIRES_TODAY
  if (diff === 1) return URGENCY_BUCKETS.EXPIRES_TOMORROW
  if (diff <= 3) return URGENCY_BUCKETS.WITHIN_3_DAYS
  if (diff <= 7) return URGENCY_BUCKETS.WITHIN_7_DAYS
  return URGENCY_BUCKETS.HEALTHY
}

export function bucketLabel(bucket) {
  return BUCKET_LABELS[bucket] || bucket
}

// Urgency sort order: most urgent first (expired first, then soonest expiry)
export function sortByUrgency(members) {
  return [...members].sort((a, b) => daysUntil(a.expiryDate) - daysUntil(b.expiryDate))
}

export function groupByUrgency(members) {
  const groups = {
    [URGENCY_BUCKETS.EXPIRED]: [],
    [URGENCY_BUCKETS.EXPIRES_TODAY]: [],
    [URGENCY_BUCKETS.EXPIRES_TOMORROW]: [],
    [URGENCY_BUCKETS.WITHIN_3_DAYS]: [],
    [URGENCY_BUCKETS.WITHIN_7_DAYS]: []
  }
  members.forEach((m) => {
    const bucket = getUrgencyBucket(m.expiryDate)
    if (groups[bucket]) groups[bucket].push(m)
  })
  Object.keys(groups).forEach((key) => { groups[key] = sortByUrgency(groups[key]) })
  return groups
}

/**
 * Maps remaining validity to a percentage (0-100) and a color on the
 * dark-green -> green -> light-green -> yellow -> orange -> red -> grey
 * scale, relative to the plan's total duration.
 */
export function getValidityIndicator(joiningDateStr, expiryDateStr) {
  const totalDays = Math.max(1, daysUntil(expiryDateStr) + daysSince(joiningDateStr))
  const remaining = daysUntil(expiryDateStr)

  if (remaining < 0) {
    return { percent: 0, color: 'vitality-expired', hex: '#5B616E', label: 'Expired' }
  }
  const percent = Math.max(0, Math.min(100, Math.round((remaining / totalDays) * 100)))

  let hex, label
  if (remaining > 14 && percent > 60) { hex = '#1B6E4C'; label = 'Healthy' }
  else if (percent > 40) { hex = '#3C9A5C'; label = 'Good' }
  else if (percent > 25) { hex = '#8FBF4E'; label = 'Fair' }
  else if (remaining > 7) { hex = '#E0B93B'; label = 'Watch' }
  else if (remaining > 3) { hex = '#DE8A3A'; label = 'Soon' }
  else { hex = '#C6462F'; label = 'Critical' }

  return { percent, hex, label }
}

function daysSince(dateStr) {
  const diff = daysUntil(dateStr)
  return Math.max(1, -diff)
}
