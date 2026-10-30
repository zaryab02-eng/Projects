// Bottom sheet on mobile, centered dialog on desktop.
import { useEffect } from "react";
import Icon from "./Icon.jsx";

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-ink-800 w-full sm:max-w-md rounded-t-[28px] sm:rounded-[24px] shadow-sheet border border-ink-700/60 max-h-[88dvh] flex flex-col animate-sheet-up sm:animate-fade-up">
        <div className="sm:hidden mx-auto mt-2.5 h-1 w-9 rounded-full bg-ink-600 shrink-0" />
        <div className="flex items-center justify-between px-6 pt-4 pb-2 shrink-0">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 rounded-full bg-ink-700 hover:bg-ink-600 flex items-center justify-center text-ink-300 transition-colors"
          >
            <Icon name="x" size={16} strokeWidth={2.2} />
          </button>
        </div>
        <div className="px-6 pt-2 pb-6 overflow-y-auto flex-1 min-h-0">
          {children}
        </div>
        {footer && (
          <div className="px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-ink-700/60 flex gap-2.5 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
