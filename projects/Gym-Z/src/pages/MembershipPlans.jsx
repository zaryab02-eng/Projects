import { useEffect, useState } from 'react'
import AppShell from '../components/layout/AppShell.jsx'
import PlanCard from '../components/plans/PlanCard.jsx'
import PlanFormModal from '../components/plans/PlanFormModal.jsx'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Card from '../components/ui/Card.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { subscribeToPlans, addPlan, updatePlan, deletePlan } from '../firebase/firestore.js'

export default function MembershipPlans() {
  const { gymId } = useAuth()
  const [plans, setPlans] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!gymId) return
    return subscribeToPlans(gymId, setPlans)
  }, [gymId])

  const handleSubmit = async (values) => {
    setSubmitting(true)
    try {
      if (editingPlan) await updatePlan(gymId, editingPlan.id, values)
      else await addPlan(gymId, values)
      setModalOpen(false)
      setEditingPlan(null)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (plan) => {
    if (confirm(`Delete "${plan.name}"? This cannot be undone.`)) {
      await deletePlan(gymId, plan.id)
    }
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl sm:text-3xl">Membership Plans</h1>
        <Button size="sm" onClick={() => { setEditingPlan(null); setModalOpen(true) }}>+ New Plan</Button>
      </div>

      {!plans ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : plans.length === 0 ? (
        <Card className="p-10 text-center text-ink-500 text-sm">
          No plans yet. Create your first membership plan — e.g. "30 Days" at ₹700.
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} onEdit={(plan) => { setEditingPlan(plan); setModalOpen(true) }} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <PlanFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingPlan(null) }}
        onSubmit={handleSubmit}
        initialValues={editingPlan}
        submitting={submitting}
      />
    </AppShell>
  )
}
