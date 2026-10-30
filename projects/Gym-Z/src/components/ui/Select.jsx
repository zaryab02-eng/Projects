export default function Select({
  label,
  error,
  options = [],
  required,
  className = "",
  ...props
}) {
  return (
    <label className="block">
      {label && (
        <span className="block text-[13px] font-medium text-ink-300 mb-1.5">
          {label}
          {required && <span className="text-copper-400"> *</span>}
        </span>
      )}
      <select
        className={`select-chevron w-full h-11 bg-ink-900 border ${error ? "border-vitality-critical" : "border-ink-600"} rounded-xl pl-3.5 text-[15px] text-ink-50 focus:border-copper-500 focus:ring-4 focus:ring-copper-500/15 outline-none transition ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="block mt-1.5 text-xs text-vitality-critical">
          {error}
        </span>
      )}
    </label>
  );
}
