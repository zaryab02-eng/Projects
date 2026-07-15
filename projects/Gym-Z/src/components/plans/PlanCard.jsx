import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'

export default function PlanCard({ plan, onEdit, onDelete }) {
  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-lg">{plan.name}</h4>
        <span className="font-mono text-xs text-ink-500">{plan.durationDays} days</span>
      </div>
      <p className="font-mono text-2xl font-semibold text-copper-400">₹{plan.fee}</p>
      <div className="flex gap-2 mt-1">
        <Button variant="ghost" size="sm" className="flex-1" onClick={() => onEdit(plan)}>Edit</Button>
        <Button variant="danger" size="sm" className="flex-1" onClick={() => onDelete(plan)}>Delete</Button>
      </div>
    </Card>
  )
}
