export default function Input({
  label,
  error,
  className = "",
  wrapperClassName = "",
  required,
  ...props
}) {
  return (
    <label className={`block ${wrapperClassName}`}>
      {label && (
        <span className="block text-[13px] font-medium text-ink-300 mb-1.5">
          {label}
          {required && <span className="text-copper-400"> *</span>}
        </span>
      )}
      <input
        className={`w-full h-11 bg-ink-900 border ${error ? "border-vitality-critical" : "border-ink-600"} rounded-xl px-3.5 text-[15px] text-ink-50 placeholder:text-ink-500/70 focus:border-copper-500 focus:ring-4 focus:ring-copper-500/15 outline-none transition ${className}`}
        {...props}
      />
      {error && (
        <span className="block mt-1.5 text-xs text-vitality-critical">
          {error}
        </span>
      )}
    </label>
  );
}
