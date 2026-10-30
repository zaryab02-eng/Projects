export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-ink-800 rounded-xl2 shadow-card border border-ink-700/60 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
