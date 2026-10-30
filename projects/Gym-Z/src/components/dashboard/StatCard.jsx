import Icon from "../ui/Icon.jsx";

const TONES = {
  default: "bg-ink-700 text-ink-100",
  copper: "bg-copper-500/15 text-copper-400",
  critical: "bg-vitality-critical/15 text-vitality-critical",
  warn: "bg-vitality-warn/15 text-vitality-warn",
  steel: "bg-steel-500/15 text-steel-300",
};

export default function StatCard({
  label,
  value,
  tone = "default",
  icon,
  onClick,
  featured = false,
  className = "",
}) {
  const content = (
    <div
      className={`flex ${featured ? "flex-row items-center gap-4 lg:flex-col lg:items-start lg:gap-0" : "flex-col"}`}
    >
      <span
        className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${TONES[tone]}`}
      >
        <Icon name={icon} size={20} />
      </span>
      <div className={featured ? "lg:mt-4" : "mt-4"}>
        <p className="text-[32px] leading-none font-semibold tracking-tight font-mono">
          {value}
        </p>
        <p className="text-[13px] font-medium text-ink-500 mt-1.5">{label}</p>
      </div>
      {onClick && featured && (
        <Icon
          name="chevronRight"
          size={18}
          className="ml-auto text-ink-500 lg:hidden"
        />
      )}
    </div>
  );

  const base = `bg-ink-800 rounded-xl2 shadow-card border border-ink-700/60 p-4 sm:p-5 animate-fade-up ${className}`;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} w-full text-left cursor-pointer hover:border-ink-600 active:scale-[0.98] transition-all`}
      >
        {content}
      </button>
    );
  }
  return <div className={base}>{content}</div>;
}
