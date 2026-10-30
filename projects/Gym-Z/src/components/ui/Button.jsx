// Pill buttons. Primary = copper, secondary = neutral fill.
export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  loading,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-full whitespace-nowrap select-none transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]";

  const variants = {
    primary: "bg-copper-500 text-white hover:bg-copper-600",
    secondary: "bg-ink-700 text-ink-50 hover:bg-ink-600",
    ghost:
      "bg-transparent text-ink-100 border border-ink-600 hover:bg-ink-700/60",
    danger: "bg-vitality-critical text-white hover:brightness-95",
    subtle: "bg-ink-700 text-ink-100 hover:bg-ink-600",
  };

  const sizes = {
    sm: "h-9 px-4 text-[13px]",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-7 text-[15px]",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
