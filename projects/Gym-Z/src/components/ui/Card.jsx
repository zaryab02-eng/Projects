export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-ink-800 light:bg-white rounded-xl2 shadow-card border border-ink-700/60 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
