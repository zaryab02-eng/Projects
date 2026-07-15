const VARIANTS = {
  verified: 'bg-steel-500/15 text-steel-300 border-steel-500/30',
  neutral: 'bg-ink-700 text-ink-50 border-ink-600',
  warn: 'bg-vitality-warn/15 text-vitality-warn border-vitality-warn/30',
  critical: 'bg-vitality-critical/15 text-vitality-critical border-vitality-critical/30',
  success: 'bg-vitality-full/15 text-[#4CAF7D] border-vitality-full/30'
}

export default function Badge({ children, variant = 'neutral', icon, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${VARIANTS[variant]} ${className}`}>
      {icon}{children}
    </span>
  )
}
