// Bottom sheet offering "Take photo" / "Choose from gallery" (+ optional remove).
import { useRef } from "react";
import { createPortal } from "react-dom";
import Modal from "./Modal.jsx";
import Icon from "./Icon.jsx";

const rowClass =
  "w-full flex items-center gap-3 p-3 rounded-2xl bg-ink-900 hover:bg-ink-700/60 text-left transition-colors";

export default function ImageSourceSheet({
  open,
  onClose,
  onFile,
  title = "Add photo",
  camera = "environment", // "user" for selfies, "environment" for documents
  onRemove,
  removeLabel = "Remove photo",
  children,
}) {
  const camRef = useRef(null);
  const galRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) onFile(file);
  };

  return createPortal(
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-3">
        {children}
        <button
          type="button"
          className={rowClass}
          onClick={() => camRef.current?.click()}
        >
          <span className="h-10 w-10 rounded-full bg-copper-500/15 text-copper-400 flex items-center justify-center shrink-0">
            <Icon name="camera" size={19} />
          </span>
          <span className="flex-1 text-[15px] font-semibold">Take photo</span>
          <Icon name="chevronRight" size={16} className="text-ink-500" />
        </button>
        <button
          type="button"
          className={rowClass}
          onClick={() => galRef.current?.click()}
        >
          <span className="h-10 w-10 rounded-full bg-steel-500/15 text-steel-300 flex items-center justify-center shrink-0">
            <Icon name="image" size={19} />
          </span>
          <span className="flex-1 text-[15px] font-semibold">
            Choose from gallery
          </span>
          <Icon name="chevronRight" size={16} className="text-ink-500" />
        </button>
        {onRemove && (
          <button type="button" className={rowClass} onClick={onRemove}>
            <span className="h-10 w-10 rounded-full bg-vitality-critical/15 text-vitality-critical flex items-center justify-center shrink-0">
              <Icon name="trash" size={19} />
            </span>
            <span className="flex-1 text-[15px] font-semibold text-vitality-critical">
              {removeLabel}
            </span>
          </button>
        )}
        <input
          ref={camRef}
          type="file"
          accept="image/*"
          capture={camera}
          hidden
          onChange={handleChange}
        />
        <input
          ref={galRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleChange}
        />
      </div>
    </Modal>,
    document.body,
  );
}
