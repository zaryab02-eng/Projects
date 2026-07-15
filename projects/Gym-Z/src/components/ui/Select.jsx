export default function Select({ label, error, options = [], required, className = '', ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="block text-xs font-semibold uppercase tracking-wide text-ink-500 mb-1.5">
          {label}{required && <span className="text-copper-400"> *</span>}
        </span>
      )}
      <select
        className={`w-full bg-ink-900 border ${error ? 'border-vitality-critical' : 'border-ink-600'} rounded-lg px-3.5 py-2.5 text-sm text-ink-50 focus:border-copper-500 focus:ring-1 focus:ring-copper-500 outline-none transition-colors ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="block mt-1 text-xs text-vitality-critical">{error}</span>}
    </label>
  )
}
