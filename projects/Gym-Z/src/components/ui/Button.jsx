// Base button with copper (primary), steel (secondary), ghost and danger
// variants. All interactive elements route through this so hover/focus/
// disabled states stay consistent app-wide.
export default function Button({
  children, variant = 'primary', size = 'md', className = '', disabled, loading, ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-body font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'

  const variants = {
    primary: 'bg-copper-500 text-white hover:bg-copper-400 shadow-glow',
    secondary: 'bg-steel-500 text-white hover:bg-steel-400',
    ghost: 'bg-transparent text-ink-50 hover:bg-ink-700 border border-ink-600',
    danger: 'bg-vitality-critical text-white hover:opacity-90',
    subtle: 'bg-ink-800 text-ink-50 hover:bg-ink-700'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base'
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  )
}
