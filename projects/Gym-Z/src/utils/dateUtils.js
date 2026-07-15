// Date helpers used across dashboard, member cards and profiles.
// Dates are stored in Firestore as 'YYYY-MM-DD' strings for simple querying
// and predictable sorting; these helpers convert to/from JS Date objects.

export function toDate(dateStr) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayStr() {
  return formatDate(new Date())
}

export function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(dateStr, days) {
  const date = toDate(dateStr)
  date.setDate(date.getDate() + days)
  return formatDate(date)
}

/** Whole-day difference between expiry and today. Negative = already expired. */
export function daysUntil(expiryDateStr) {
  const today = toDate(todayStr())
  const expiry = toDate(expiryDateStr)
  const diffMs = expiry.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)
  return Math.round(diffMs / 86400000)
}

export function formatDisplayDate(dateStr) {
  if (!dateStr) return '—'
  return toDate(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
