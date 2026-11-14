// Crop sheet: circular frame for avatars, rectangular for documents.
// Drag to move, slider / pinch / wheel to zoom. Plain canvas.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Modal from "./Modal.jsx";
import Button from "./Button.jsx";
import Spinner from "./Spinner.jsx";
import usePanZoom from "../../utils/usePanZoom.js";
import { loadImageForCrop, renderCrop } from "../../utils/imageUtils.js";

const MAX_ZOOM = 5;

export default function ImageCropSheet({
  file,
  preset = "avatar",
  title,
  onSave,
  onCancel,
}) {
  const [source, setSource] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState({ zoom: 1, ox: 0, oy: 0 });
  const canvasRef = useRef(null);

  useEffect(() => {
    let alive = true;
    setSource(null);
    setError("");
    loadImageForCrop(file, preset)
      .then((canvas) => {
        if (!alive) return;
        setView({ zoom: 1, ox: 0, oy: 0 });
        setSource(canvas);
      })
      .catch(() => {
        if (alive) setError("Could not read this image. Try another photo.");
      });
    return () => {
      alive = false;
    };
  }, [file, preset]);

  const frame = useMemo(() => {
    if (!source) return null;
    if (preset === "avatar") return { w: 260, h: 260 };
    const maxW = 320;
    const maxH = 360;
    const ar = source.width / source.height;
    let w = maxW;
    let h = w / ar;
    if (h > maxH) {
      h = maxH;
      w = h * ar;
    }
    return { w: Math.round(w), h: Math.round(h) };
  }, [source, preset]);

  const base =
    source && frame
      ? Math.max(frame.w / source.width, frame.h / source.height)
      : 1;

  const clamp = useCallback(
    (v) => {
      if (!source || !frame) return v;
      const zoom = Math.min(MAX_ZOOM, Math.max(1, v.zoom));
      const s = base * zoom;
      const mx = Math.max(0, (source.width * s - frame.w) / 2);
      const my = Math.max(0, (source.height * s - frame.h) / 2);
      return {
        zoom,
        ox: Math.min(mx, Math.max(-mx, v.ox)),
        oy: Math.min(my, Math.max(-my, v.oy)),
      };
    },
    [source, frame, base],
  );

  const handlers = usePanZoom(view, setView, clamp);

  useEffect(() => {
    if (!source || !frame || !canvasRef.current) return;
    const c = canvasRef.current;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(frame.w * dpr);
    c.height = Math.round(frame.h * dpr);
    const ctx = c.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingQuality = "high";
    const s = base * view.zoom;
    const dw = source.width * s;
    const dh = source.height * s;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, frame.w, frame.h);
    ctx.drawImage(
      source,
      frame.w / 2 + view.ox - dw / 2,
      frame.h / 2 + view.oy - dh / 2,
      dw,
      dh,
    );
  }, [source, frame, base, view]);

  const handleSave = async () => {
    if (!source || !frame) return;
    setSaving(true);
    try {
      const s = base * view.zoom;
      const sw = frame.w / s;
      const sh = frame.h / s;
      let sx = source.width / 2 - (frame.w / 2 + view.ox) / s;
      let sy = source.height / 2 - (frame.h / 2 + view.oy) / s;
      sx = Math.max(0, Math.min(source.width - sw, sx));
      sy = Math.max(0, Math.min(source.height - sh, sy));
      const url = renderCrop(source, { sx, sy, sw, sh }, preset);
      await onSave(url);
    } catch (e) {
      console.warn("Crop save failed:", e);
      setError("Could not save this image. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <Modal
      open
      onClose={onCancel}
      title={title || (preset === "avatar" ? "Adjust photo" : "Crop document")}
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="w-full"
            loading={saving}
            disabled={!source}
            onClick={handleSave}
          >
            Save
          </Button>
        </>
      }
    >
      {error && !source ? (
        <p className="text-sm text-vitality-critical text-center py-10">
          {error}
        </p>
      ) : !source || !frame ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5">
          <div
            className="relative overflow-hidden rounded-2xl bg-black select-none"
            style={{ width: frame.w, height: frame.h, touchAction: "none" }}
            {...handlers}
          >
            <canvas
              ref={canvasRef}
              style={{ width: frame.w, height: frame.h, display: "block" }}
            />
            {preset === "avatar" && (
              <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  boxShadow: "0 0 0 999px rgba(0,0,0,0.55)",
                  border: "2px solid rgba(255,255,255,0.9)",
                }}
              />
            )}
          </div>
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={view.zoom}
            aria-label="Zoom"
            onChange={(e) =>
              setView((v) => clamp({ ...v, zoom: Number(e.target.value) }))
            }
            className="w-full max-w-[320px] accent-copper-500"
          />
          <p className="text-xs text-ink-500 text-center">
            Drag to move. Pinch or use the slider to zoom.
          </p>
          {error && (
            <p className="text-xs text-vitality-critical text-center">
              {error}
            </p>
          )}
        </div>
      )}
    </Modal>,
    document.body,
  );
}
