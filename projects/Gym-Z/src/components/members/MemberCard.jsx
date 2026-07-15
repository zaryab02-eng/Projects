import { Link } from 'react-router-dom'
import Card from '../ui/Card.jsx'
import ValidityBar from '../ui/ValidityBar.jsx'
import Badge from '../ui/Badge.jsx'
import { formatStreak } from '../../utils/streakUtils.js'
import { daysUntil } from '../../utils/dateUtils.js'

export default function MemberCard({ member }) {
  const remaining = daysUntil(member.expiryDate)
  const streakLabel = formatStreak(member.streakCount)

  return (
    <Link to={`/members/${member.id}`}>
      <Card className="p-4 hover:border-copper-500/50 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold truncate">{member.fullName}</p>
            <p className="text-xs text-ink-500 font-mono">{member.phone}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {member.blacklisted && <Badge variant="critical">Blacklisted</Badge>}
            {streakLabel && <span className="text-xs font-mono text-copper-400">🔥 {streakLabel}</span>}
          </div>
        </div>

        <div className="mt-3">
          <ValidityBar joiningDate={member.joiningDate} expiryDate={member.expiryDate} />
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-ink-500">
          <span>{member.planName}</span>
          <span className="font-mono">{remaining >= 0 ? `${remaining}d left` : `${-remaining}d overdue`}</span>
        </div>
      </Card>
    </Link>
  )
}
