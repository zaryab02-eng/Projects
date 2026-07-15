export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-ink-800 w-full sm:max-w-lg sm:rounded-xl2 rounded-t-xl2 shadow-card max-h-[90vh] overflow-y-auto animate-fade-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-700 sticky top-0 bg-ink-800 z-10">
          <h3 className="font-display text-lg">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="h-8 w-8 rounded-full hover:bg-ink-700 flex items-center justify-center text-ink-500">✕</button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-ink-700 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}
