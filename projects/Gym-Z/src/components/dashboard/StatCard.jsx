import Card from '../ui/Card.jsx'

export default function StatCard({ label, value, tone = 'default', icon }) {
  const toneStyles = {
    default: 'text-ink-50',
    copper: 'text-copper-400',
    critical: 'text-vitality-critical',
    warn: 'text-vitality-warn',
    steel: 'text-steel-300'
  }
  return (
    <Card className="p-4 sm:p-5 animate-fade-up">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <p className={`font-mono text-3xl font-semibold mt-2 ${toneStyles[tone]}`}>{value}</p>
    </Card>
  )
}
