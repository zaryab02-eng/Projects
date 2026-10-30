const VARIANTS = {
  neutral: "bg-ink-700 text-ink-300",
  warn: "bg-vitality-warn/15 text-vitality-warn",
  critical: "bg-vitality-critical/15 text-vitality-critical",
  success: "bg-vitality-full/15 text-vitality-full",
};

export default function Badge({
  children,
  variant = "neutral",
  icon,
  className = "",
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${VARIANTS[variant]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
