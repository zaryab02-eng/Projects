import { formatDisplayDate } from '../../utils/dateUtils.js'
import Card from '../ui/Card.jsx'

export default function RenewalHistory({ renewals }) {
  if (!renewals?.length) {
    return <Card className="p-6 text-center text-ink-500 text-sm">No renewal history yet.</Card>
  }
  return (
    <div className="space-y-2">
      {renewals.map((r) => (
        <Card key={r.id} className="p-3.5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">{r.planName} {r.type === 'new' && <span className="text-copper-400 text-xs">(Joined)</span>}</p>
            <p className="text-xs text-ink-500 font-mono">{formatDisplayDate(r.startDate)} → {formatDisplayDate(r.expiryDate)}</p>
          </div>
          <p className="font-mono text-sm font-semibold">₹{r.amount}</p>
        </Card>
      ))}
    </div>
  )
}
