// Full-screen image viewer with pinch / wheel zoom, drag and optional
// action buttons. Shared by member documents and the profile picture.
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon.jsx";
import usePanZoom from "../../utils/usePanZoom.js";

export default function ImageViewer({
  src,
  title,
  onClose,
  actions = [], // [{ label, icon, onClick, danger }]
  imgClassName = "max-h-full max-w-full object-contain",
  imgStyle,
}) {
  const [view, setView] = useState({ zoom: 1, ox: 0, oy: 0 });

  const clamp = useCallback((v) => {
    const zoom = Math.min(5, Math.max(1, v.zoom));
    const mx = ((zoom - 1) * window.innerWidth) / 2;
    const my = ((zoom - 1) * window.innerHeight) / 2;
    return {
      zoom,
      ox: Math.min(mx, Math.max(-mx, v.ox)),
      oy: Math.min(my, Math.max(-my, v.oy)),
    };
  }, []);

  const handlers = usePanZoom(view, setView, clamp);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[70] bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 shrink-0">
        <p className="text-white font-semibold truncate">{title}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="h-9 w-9 rounded-full bg-white/15 text-white flex items-center justify-center"
        >
          <Icon name="x" size={18} strokeWidth={2.2} />
        </button>
      </div>

      <div
        className="flex-1 min-h-0 overflow-hidden flex items-center justify-center select-none"
        style={{ touchAction: "none" }}
        onDoubleClick={() => setView({ zoom: 1, ox: 0, oy: 0 })}
        {...handlers}
      >
        <img
          src={src}
          alt={title}
          draggable={false}
          className={imgClassName}
          style={{
            ...imgStyle,
            transform: `translate(${view.ox}px, ${view.oy}px) scale(${view.zoom})`,
          }}
        />
      </div>

      {actions.length > 0 && (
        <div className="flex gap-3 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] shrink-0">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={a.onClick}
              className={`flex-1 h-11 rounded-full text-white text-[15px] font-semibold flex items-center justify-center gap-2 ${
                a.danger ? "bg-red-500/90" : "bg-white/15"
              }`}
            >
              {a.icon && <Icon name={a.icon} size={17} />}
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}
