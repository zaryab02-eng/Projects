import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import ValidityBar from '../components/ui/ValidityBar.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Modal from '../components/ui/Modal.jsx'
import Select from '../components/ui/Select.jsx'
import RenewalHistory from '../components/members/RenewalHistory.jsx'
import AddToBlacklistModal from '../components/blacklist/AddToBlacklistModal.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getMember, getMemberRenewals, subscribeToPlans, renewMembership, addToBlacklist, removeFromBlacklist } from '../firebase/firestore.js'
import { formatDisplayDate, daysUntil, addDays } from '../utils/dateUtils.js'
import { formatStreak, computeNextStreak } from '../utils/streakUtils.js'

export default function MemberProfile() {
  const { memberId } = useParams()
  const { gymId } = useAuth()
  const navigate = useNavigate()
  const [member, setMember] = useState(null)
  const [renewals, setRenewals] = useState([])
  const [plans, setPlans] = useState([])
  const [renewOpen, setRenewOpen] = useState(false)
  const [blacklistOpen, setBlacklistOpen] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    const [m, r] = await Promise.all([getMember(gymId, memberId), getMemberRenewals(gymId, memberId)])
    setMember(m)
    setRenewals(r)
  }

  useEffect(() => { if (gymId) load() }, [gymId, memberId])
  useEffect(() => { if (gymId) return subscribeToPlans(gymId, setPlans) }, [gymId])

  const handleRenew = async () => {
    const plan = plans.find((p) => p.id === selectedPlanId)
    if (!plan) return
    setSubmitting(true)
    try {
      const streak = computeNextStreak(member.expiryDate, member.streakCount)
      const startDate = new Date().toISOString().slice(0, 10)
      const expiryDate = addDays(startDate, plan.durationDays)
      await renewMembership(gymId, memberId, {
        planName: plan.name, membershipFee: plan.fee, startDate, expiryDate,
        newStreakCount: streak.count, newStreakUnit: 'month'
      })
      setRenewOpen(false)
      await load()
    } finally {
      setSubmitting(false)
    }
  }

  const handleBlacklist = async ({ reason, notes }) => {
    setSubmitting(true)
    try {
      await addToBlacklist(gymId, memberId, { reason, notes })
      setBlacklistOpen(false)
      await load()
    } finally {
      setSubmitting(false)
    }
  }

  if (!member) {
    return <AppShell><div className="flex justify-center py-20"><Spinner size="lg" /></div></AppShell>
  }

  const remaining = daysUntil(member.expiryDate)
  const streakLabel = formatStreak(member.streakCount)

  return (
    <AppShell>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display text-2xl sm:text-3xl">{member.fullName}</h1>
            {member.blacklisted && <Badge variant="critical">Blacklisted</Badge>}
          </div>
          <p className="text-ink-500 font-mono text-sm mt-1">{member.phone}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setBlacklistOpen(true)} disabled={member.blacklisted}>
            {member.blacklisted ? 'Blacklisted' : 'Blacklist'}
          </Button>
          <Button size="sm" onClick={() => { setSelectedPlanId(plans[0]?.id || ''); setRenewOpen(true) }}>Renew Membership</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-5">
            <h2 className="font-display text-lg mb-4">Current Membership</h2>
            <ValidityBar joiningDate={member.joiningDate} expiryDate={member.expiryDate} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 text-sm">
              <Info label="Plan" value={member.planName} />
              <Info label="Joined" value={formatDisplayDate(member.joiningDate)} />
              <Info label="Expires" value={formatDisplayDate(member.expiryDate)} />
              <Info label="Status" value={remaining >= 0 ? `${remaining}d left` : `${-remaining}d overdue`} />
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-display text-lg mb-4">Membership & Renewal History</h2>
            <RenewalHistory renewals={renewals} />
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5 text-center">
            <p className="text-xs uppercase text-ink-500 mb-2">Membership Streak</p>
            <p className="text-3xl font-mono font-bold text-copper-400">🔥 {streakLabel || 'New Member'}</p>
          </Card>

          <Card className="p-5 text-center">
            <p className="text-xs uppercase text-ink-500 mb-2">Lifetime Amount Paid</p>
            <p className="text-3xl font-mono font-bold">₹{member.lifetimeAmountPaid || 0}</p>
          </Card>

          <Card className="p-5">
            <h3 className="font-display text-base mb-3">Personal Information</h3>
            <div className="space-y-2 text-sm">
              <Info label="Alt Phone" value={member.altPhone || '—'} />
              <Info label="Age" value={member.age || '—'} />
              <Info label="Gender" value={member.gender || '—'} />
              <Info label="Address" value={member.address || '—'} />
              <Info label="Notes" value={member.notes || '—'} />
            </div>
          </Card>
        </div>
      </div>

      <Modal open={renewOpen} onClose={() => setRenewOpen(false)} title="Renew Membership">
        <div className="space-y-4">
          <Select
            label="Select Plan" value={selectedPlanId} onChange={(e) => setSelectedPlanId(e.target.value)}
            options={plans.map((p) => ({ value: p.id, label: `${p.name} — ₹${p.fee}` }))}
          />
          <Button className="w-full" loading={submitting} onClick={handleRenew}>Confirm Renewal</Button>
        </div>
      </Modal>

      <AddToBlacklistModal open={blacklistOpen} onClose={() => setBlacklistOpen(false)} onSubmit={handleBlacklist} submitting={submitting} />
    </AppShell>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-[11px] uppercase text-ink-500">{label}</p>
      <p className="font-medium mt-0.5 break-words">{value}</p>
    </div>
  )
}
