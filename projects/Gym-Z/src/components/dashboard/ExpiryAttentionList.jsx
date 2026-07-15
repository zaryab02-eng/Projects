// The "members requiring attention" panel below the dashboard cards,
// auto-sorted by urgency into the five categories from the spec.
import { Link } from 'react-router-dom'
import { groupByUrgency, bucketLabel } from '../../utils/membershipUtils.js'
import { formatDisplayDate } from '../../utils/dateUtils.js'
import Card from '../ui/Card.jsx'
import Badge from '../ui/Badge.jsx'

const BUCKET_TONE = {
  expired: 'critical',
  expires_today: 'critical',
  expires_tomorrow: 'warn',
  within_3_days: 'warn',
  within_7_days: 'neutral'
}

export default function ExpiryAttentionList({ members }) {
  const groups = groupByUrgency(members)
  const order = ['expired', 'expires_today', 'expires_tomorrow', 'within_3_days', 'within_7_days']
  const hasAny = order.some((k) => groups[k].length > 0)

  if (!hasAny) {
    return (
      <Card className="p-8 text-center text-ink-500">
        No members need attention right now. Every membership is healthy. 💪
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      {order.map((bucket) => (
        groups[bucket].length > 0 && (
          <div key={bucket}>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={BUCKET_TONE[bucket]}>{bucketLabel(bucket)}</Badge>
              <span className="text-xs text-ink-500 font-mono">{groups[bucket].length}</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {groups[bucket].map((m) => (
                <Link
                  key={m.id}
                  to={`/members/${m.id}`}
                  className="flex items-center justify-between bg-ink-800 border border-ink-700 rounded-lg px-4 py-3 hover:border-copper-500/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold">{m.fullName}</p>
                    <p className="text-xs text-ink-500 font-mono">{m.phone}</p>
                  </div>
                  <span className="text-xs font-mono text-ink-500">{formatDisplayDate(m.expiryDate)}</span>
                </Link>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  )
}
