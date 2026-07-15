// Shown when a phone number entered in Add Member already exists for this
// gym. Surfaces full history + a Renew Membership shortcut instead of
// letting the owner create a second record for the same person.
import { Link } from 'react-router-dom'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Badge from '../ui/Badge.jsx'
import { formatDisplayDate } from '../../utils/dateUtils.js'
import { formatStreak } from '../../utils/streakUtils.js'

export default function DuplicateMemberModal({ member, open, onClose, onRenew }) {
  if (!member) return null
  const streakLabel = formatStreak(member.streakCount)

  return (
    <Modal open={open} onClose={onClose} title="Member Already Exists">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-lg">{member.fullName}</p>
            <p className="text-xs text-ink-500 font-mono">{member.phone}</p>
          </div>
          {member.blacklisted && <Badge variant="critical">Blacklisted</Badge>}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-ink-900 rounded-lg p-3">
            <p className="text-xs text-ink-500 uppercase mb-1">Current Plan</p>
            <p className="font-semibold">{member.planName}</p>
          </div>
          <div className="bg-ink-900 rounded-lg p-3">
            <p className="text-xs text-ink-500 uppercase mb-1">Expiry Date</p>
            <p className="font-semibold">{formatDisplayDate(member.expiryDate)}</p>
          </div>
          <div className="bg-ink-900 rounded-lg p-3">
            <p className="text-xs text-ink-500 uppercase mb-1">Lifetime Paid</p>
            <p className="font-semibold font-mono">₹{member.lifetimeAmountPaid || 0}</p>
          </div>
          <div className="bg-ink-900 rounded-lg p-3">
            <p className="text-xs text-ink-500 uppercase mb-1">Streak</p>
            <p className="font-semibold text-copper-400">{streakLabel || '—'}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Link to={`/members/${member.id}`} className="flex-1">
            <Button variant="ghost" className="w-full">View Full History</Button>
          </Link>
          <Button variant="primary" className="flex-1" onClick={() => onRenew(member)}>Renew Membership</Button>
        </div>
      </div>
    </Modal>
  )
}
