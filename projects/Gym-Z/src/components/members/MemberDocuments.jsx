// Two optional document slots (e.g. Aadhaar front/back). Works on staged
// (local) data in Add Member and on live Firestore data in the profile:
// the caller supplies documents + onSave/onDelete.
import { useState } from "react";
import Icon from "../ui/Icon.jsx";
import ImageSourceSheet from "../ui/ImageSourceSheet.jsx";
import ImageCropSheet from "../ui/ImageCropSheet.jsx";
import ImageViewer from "../ui/ImageViewer.jsx";

const SLOTS = [
  { id: "slot1", fallback: "Front" },
  { id: "slot2", fallback: "Back" },
];
const QUICK_LABELS = ["Front", "Back", "Aadhaar", "PAN", "ID"];

export default function MemberDocuments({ documents = [], onSave, onDelete }) {
  const [target, setTarget] = useState(null);
  const [label, setLabel] = useState("");
  const [file, setFile] = useState(null);
  const [viewingId, setViewingId] = useState(null);

  const byId = (id) => documents.find((d) => d.id === id);

  const startPick = (slot) => {
    setViewingId(null);
    setLabel(byId(slot.id)?.label || slot.fallback);
    setTarget(slot);
  };
  const finish = () => {
    setTarget(null);
    setFile(null);
  };

  const handleCropSave = async (imageData) => {
    await onSave(target.id, {
      label: label.trim() || target.fallback,
      imageData,
    });
    finish();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    await onDelete(id);
    setViewingId(null);
  };

  const viewing = viewingId ? byId(viewingId) : null;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {SLOTS.map((slot) => {
          const d = byId(slot.id);
          return d ? (
            <button
              key={slot.id}
              type="button"
              onClick={() => setViewingId(slot.id)}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-ink-900 border border-ink-700/60 active:scale-[0.98] transition-transform"
            >
              <img
                src={d.imageData}
                alt={d.label}
                draggable={false}
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 px-3 py-2 text-left text-xs font-semibold text-white bg-gradient-to-t from-black/70 to-transparent truncate">
                {d.label}
              </span>
            </button>
          ) : (
            <button
              key={slot.id}
              type="button"
              onClick={() => startPick(slot)}
              className="aspect-[4/3] rounded-2xl border-2 border-dashed border-ink-600 text-ink-500 hover:text-ink-300 hover:border-ink-500 flex flex-col items-center justify-center gap-1.5 transition-colors"
            >
              <Icon name="camera" size={22} />
              <span className="text-xs font-semibold">Add {slot.fallback}</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-ink-500 mt-3 leading-relaxed">
        Keep the card flat, in good light.
      </p>
      <p className="flex items-start gap-1.5 text-xs text-ink-500 mt-1.5 leading-relaxed">
        <Icon name="shield" size={14} className="shrink-0 mt-0.5" />
        Documents are optional and visible only to the gym owner.
      </p>

      <ImageSourceSheet
        open={Boolean(target) && !file}
        onClose={finish}
        title="Add document"
        camera="environment"
        onFile={setFile}
      >
        <div className="rounded-2xl bg-ink-900 p-3.5 space-y-2.5">
          <label className="block text-xs font-medium text-ink-500">
            Label
          </label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={30}
            placeholder="e.g. Aadhaar, PAN, ID"
            className="w-full h-11 rounded-xl bg-ink-800 border border-ink-700/60 px-3.5 text-[15px] placeholder:text-ink-500 outline-none focus:border-copper-500 focus:ring-4 focus:ring-copper-500/15 transition"
          />
          <div className="flex flex-wrap gap-1.5">
            {QUICK_LABELS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setLabel(q)}
                className="h-7 px-3 rounded-full text-xs font-semibold bg-ink-700 text-ink-300 hover:text-ink-50 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
          <p className="text-xs text-ink-500">
            Keep the card flat, in good light.
          </p>
        </div>
      </ImageSourceSheet>

      {file && target && (
        <ImageCropSheet
          file={file}
          preset="document"
          onCancel={finish}
          onSave={handleCropSave}
        />
      )}

      {viewing && (
        <ImageViewer
          src={viewing.imageData}
          title={viewing.label}
          onClose={() => setViewingId(null)}
          actions={[
            {
              label: "Replace",
              icon: "refresh",
              onClick: () => startPick(SLOTS.find((s) => s.id === viewing.id)),
            },
            {
              label: "Delete",
              icon: "trash",
              danger: true,
              onClick: () => handleDelete(viewing.id),
            },
          ]}
        />
      )}
    </div>
  );
}
