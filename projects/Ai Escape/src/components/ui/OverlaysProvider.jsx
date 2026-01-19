import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";

const ConfirmContext = createContext(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within OverlaysProvider");
  }
  return ctx;
}

export default function OverlaysProvider({ children }) {
  const resolverRef = useRef(null);
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "Confirm",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    danger: false,
  });

  const close = useCallback((value) => {
    setConfirmState((s) => ({ ...s, open: false }));
    if (resolverRef.current) {
      resolverRef.current(value);
      resolverRef.current = null;
    }
  }, []);

  const confirm = useCallback((options = {}) => {
    const {
      title = "Confirm",
      message = "",
      confirmText = "Confirm",
      cancelText = "Cancel",
      danger = false,
    } = options;

    setConfirmState({
      open: true,
      title,
      message,
      confirmText,
      cancelText,
      danger,
    });

    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "rgba(0,0,0,0.85)",
            color: "#fff",
            border: "1px solid rgba(0,255,136,0.25)",
            backdropFilter: "blur(10px)",
          },
        }}
      />

      {confirmState.open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onKeyDown={(e) => {
            if (e.key === "Escape") close(false);
          }}
        >
          <button
            className="absolute inset-0 bg-black/70"
            aria-label="Close"
            onClick={() => close(false)}
          />

          <div className="relative w-full max-w-md card border border-cyber-border rounded-2xl shadow-2xl">
            <div className="p-5">
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                {confirmState.title}
              </h3>
              {confirmState.message && (
                <p className="text-sm md:text-base text-white text-opacity-75 leading-relaxed">
                  {confirmState.message}
                </p>
              )}

              <div className="mt-5 flex gap-2 justify-end">
                <button
                  className="px-4 py-2 rounded-xl border border-cyber-border text-white text-opacity-80 hover:text-opacity-100 hover:border-cyber-accent/60 transition-all text-sm"
                  onClick={() => close(false)}
                >
                  {confirmState.cancelText}
                </button>
                <button
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    confirmState.danger
                      ? "bg-cyber-danger/20 border border-cyber-danger text-cyber-danger hover:bg-cyber-danger/30"
                      : "bg-cyber-accent/20 border border-cyber-accent text-cyber-accent hover:bg-cyber-accent/30"
                  }`}
                  onClick={() => close(true)}
                >
                  {confirmState.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

