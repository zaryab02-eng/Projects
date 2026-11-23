import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, Camera, Loader2, Check } from "lucide-react";

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
      aria-label={title}
    >
      <div className="absolute inset-0 bg-ink/60" onClick={onClose} />
      <div className="relative flex max-h-[96dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-paper sm:rounded-3xl">
        <div className="flex items-center gap-2 border-b-2 border-ink/10 bg-white px-3 py-3">
          <button
            onClick={onClose}
            className="flex h-12 items-center gap-1 rounded-xl px-3 text-base font-bold text-brand-dark hover:bg-mist"
          >
            <ChevronLeft className="h-6 w-6" /> Back
          </button>
          <h2 className="min-w-0 flex-1 truncate text-right text-xl pr-2">
            {title}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6">{children}</div>
        {footer && (
          <div className="safe-bottom border-t-2 border-ink/10 bg-white px-5 pb-4 pt-3">
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
      <span className="mb-2 block text-base font-bold">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-sm text-ink/70">{hint}</span>}
    </label>
  );
}

/** Big on/off switch with a Yes / No word, so nobody has to guess. */
export function Switch({ checked, onChange, label, hint }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border-2 border-ink/15 bg-white px-4 py-4 text-left"
    >
      <span className="min-w-0">
        <span className="block text-base font-bold">{label}</span>
        {hint && (
          <span className="mt-0.5 block text-sm text-ink/70">{hint}</span>
        )}
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span
          className={`w-8 text-sm font-bold ${checked ? "text-brand-dark" : "text-ink/60"}`}
        >
          {checked ? "Yes" : "No"}
        </span>
        <span
          className={`relative h-8 w-14 rounded-full transition ${checked ? "bg-brand-dark" : "bg-ink/25"}`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${checked ? "left-[30px]" : "left-1"}`}
          />
        </span>
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
  label = "Tap to add a photo",
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
        <div>
          <div className={`overflow-hidden rounded-2xl bg-mist ${aspect}`}>
            <img src={shown} alt="" className="h-full w-full object-contain" />
          </div>
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={() => input.current?.click()}
              className="btn-ghost flex-1"
            >
              <Camera className="h-5 w-5" /> Change photo
            </button>
            {removable && (
              <button type="button" onClick={onClear} className="btn-danger">
                Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink/30 bg-white text-ink/70 transition hover:border-brand-dark hover:text-brand-dark ${aspect === "aspect-square" ? "py-12" : aspect}`}
        >
          <Camera className="h-10 w-10" strokeWidth={1.6} />
          <span className="text-base font-bold">{label}</span>
        </button>
      )}
    </div>
  );
}

export function Spinner({ className = "h-5 w-5" }) {
  return <Loader2 className={`${className} animate-spin`} />;
}

/** Message at the top of the screen (always visible, even over a form). */
export function useToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const notify = useCallback((text, kind = "ok") => {
    clearTimeout(timer.current);
    setToast({ text, kind });
    timer.current = setTimeout(() => setToast(null), 3500);
  }, []);
  const node = toast ? (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex justify-center px-4"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 12px)" }}
    >
      <div
        role="status"
        className={`flex max-w-md items-center gap-3 rounded-2xl px-5 py-4 text-base font-bold text-white shadow-xl ${
          toast.kind === "error" ? "bg-[#b4141a]" : "bg-brand-dark"
        }`}
      >
        {toast.kind !== "error" && <Check className="h-6 w-6 shrink-0" />}
        <span>{toast.text}</span>
      </div>
    </div>
  ) : null;
  return [node, notify];
}

/** "Are you sure?" box. Use:  const [confirmNode, ask] = useConfirm();  if (await ask("...")) { ... } */
export function useConfirm() {
  const [state, setState] = useState(null);
  const ask = useCallback(
    (
      message,
      { yes = "Yes, delete", no = "No, keep it", danger = true } = {},
    ) =>
      new Promise((resolve) => setState({ message, yes, no, danger, resolve })),
    [],
  );
  const done = (v) => {
    state.resolve(v);
    setState(null);
  };
  const node = state ? (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/70 p-5"
      role="alertdialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-6">
        <p className="text-xl font-bold leading-snug">{state.message}</p>
        <div className="mt-6 space-y-3">
          <button
            onClick={() => done(true)}
            className={
              state.danger
                ? "btn w-full bg-[#b4141a] text-white"
                : "btn-primary w-full"
            }
          >
            {state.yes}
          </button>
          <button onClick={() => done(false)} className="btn-ghost w-full">
            {state.no}
          </button>
        </div>
      </div>
    </div>
  ) : null;
  return [node, ask];
}

export function friendlyError(e) {
  const code = e?.code || "";
  if (code.includes("permission-denied"))
    return "Not allowed. Your login may not be linked to this website.";
  if (code.includes("network") || e?.message === "Failed to fetch")
    return "No internet connection. Please try again.";
  return e?.message || "Something went wrong. Please try again.";
}
