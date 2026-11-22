import { useCallback, useEffect, useRef, useState } from "react";
import { X, ImagePlus, Loader2, Check } from "lucide-react";

/** Full-height bottom sheet used for editing. */
export function Sheet({ title, onClose, children, footer }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-ink/60" onClick={onClose} />
      <div className="relative flex max-h-[94dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-paper sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="text-2xl">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-mist"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && (
          <div className="safe-bottom border-t border-ink/10 bg-paper px-5 pb-4 pt-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink/50">{hint}</span>}
    </label>
  );
}

export function Switch({ checked, onChange, label, hint }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-ink/10 bg-white px-4 py-3 text-left"
    >
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        {hint && <span className="block text-xs text-ink/50">{hint}</span>}
      </span>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-brand" : "bg-ink/20"}`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

/** Pick a photo from camera or gallery, with preview. The whole photo is shown (nothing is cropped). */
export function ImagePicker({
  url,
  file,
  onPick,
  onClear,
  aspect = "aspect-square",
  label = "Add photo",
  removable = true,
}) {
  const input = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) return setPreview(null);
    const u = URL.createObjectURL(file);
    setPreview(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  const shown = preview || url;
  return (
    <div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = "";
        }}
      />
      {shown ? (
        <div
          className={`relative overflow-hidden rounded-2xl bg-mist ${aspect}`}
        >
          <img src={shown} alt="" className="h-full w-full object-contain" />
          <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-ink/70 to-transparent p-3">
            <button
              type="button"
              onClick={() => input.current?.click()}
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold"
            >
              Change photo
            </button>
            {removable && (
              <button
                type="button"
                onClick={onClear}
                className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink/20 bg-white text-ink/60 transition hover:border-brand hover:text-brand-dark ${aspect}`}
        >
          <ImagePlus className="h-8 w-8" strokeWidth={1.5} />
          <span className="text-sm font-semibold">{label}</span>
        </button>
      )}
    </div>
  );
}

export function Spinner({ className = "h-5 w-5" }) {
  return <Loader2 className={`${className} animate-spin`} />;
}

/** Small message at the bottom of the screen. */
export function useToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const notify = useCallback((text, kind = "ok") => {
    clearTimeout(timer.current);
    setToast({ text, kind });
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);
  const node = toast ? (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4">
      <div
        className={`flex max-w-md items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-xl ${
          toast.kind === "error" ? "bg-rose" : "bg-ink"
        }`}
      >
        {toast.kind !== "error" && <Check className="h-4 w-4 text-brand" />}
        {toast.text}
      </div>
    </div>
  ) : null;
  return [node, notify];
}

export function friendlyError(e) {
  const code = e?.code || "";
  if (code.includes("permission-denied"))
    return "Not allowed. Your login may not be linked to this website, or the Firestore rules are not published.";
  if (code.includes("network") || e?.message === "Failed to fetch")
    return "No internet connection. Please try again.";
  return e?.message || "Something went wrong. Please try again.";
}
