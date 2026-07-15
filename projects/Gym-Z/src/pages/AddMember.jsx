import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell.jsx'
import Card from '../components/ui/Card.jsx'
import MemberForm from '../components/members/MemberForm.jsx'
import DuplicateMemberModal from '../components/members/DuplicateMemberModal.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { subscribeToPlans, findMemberByPhone, addMember, renewMembership } from '../firebase/firestore.js'
import { addDays } from '../utils/dateUtils.js'
import { computeNextStreak } from '../utils/streakUtils.js'

export default function AddMember() {
  const { gymId } = useAuth()
  const navigate = useNavigate()
  const [plans, setPlans] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [duplicate, setDuplicate] = useState(null)
  const [pendingValues, setPendingValues] = useState(null)

  useEffect(() => {
    if (!gymId) return
    return subscribeToPlans(gymId, setPlans)
  }, [gymId])

  const handleSubmit = async (values) => {
    setSubmitting(true)
    setPendingValues(values)
    try {
      const existing = await findMemberByPhone(gymId, values.phone.trim())
      if (existing) {
        setDuplicate(existing)
        setSubmitting(false)
        return
      }
      const plan = plans.find((p) => p.id === values.planId)
      const expiryDate = addDays(values.joiningDate, plan.durationDays)
      await addMember(gymId, { ...values, expiryDate })
      navigate('/members')
    } catch (err) {
      alert('Could not add member. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRenewFromDuplicate = async (member) => {
    const plan = plans.find((p) => p.id === pendingValues.planId)
    const streak = computeNextStreak(member.expiryDate, member.streakCount)
    const startDate = new Date().toISOString().slice(0, 10)
    const expiryDate = addDays(startDate, plan.durationDays)
    await renewMembership(gymId, member.id, {
      planName: plan.name,
      membershipFee: Number(pendingValues.membershipFee),
      startDate,
      expiryDate,
      newStreakCount: streak.count,
      newStreakUnit: 'month'
    })
    navigate(`/members/${member.id}`)
  }

  return (
    <AppShell>
      <h1 className="font-display text-2xl sm:text-3xl mb-6">Add Member</h1>
      {!plans ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : plans.length === 0 ? (
        <Card className="p-6 text-center text-ink-500 text-sm">
          Create a membership plan first before adding members. Go to Membership Plans.
        </Card>
      ) : (
        <Card className="p-5 sm:p-6 max-w-2xl">
          <MemberForm plans={plans} onSubmit={handleSubmit} submitting={submitting} />
        </Card>
      )}

      <DuplicateMemberModal
        member={duplicate}
        open={!!duplicate}
        onClose={() => setDuplicate(null)}
        onRenew={handleRenewFromDuplicate}
      />
    </AppShell>
  )
}
