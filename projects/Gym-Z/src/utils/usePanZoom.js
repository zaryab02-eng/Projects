// Pointer-based drag + pinch + wheel zoom. The caller owns the view state
// ({ zoom, ox, oy }) and supplies `clamp` to keep it within bounds.
import { useRef } from "react";

export default function usePanZoom(view, setView, clamp) {
  const viewRef = useRef(view);
  viewRef.current = view;
  const pointers = useRef(new Map());
  const pinch = useRef(null);

  const distance = () => {
    const [a, b] = [...pointers.current.values()];
    return Math.hypot(a.x - b.x, a.y - b.y) || 1;
  };

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      pinch.current = { d: distance(), zoom: viewRef.current.zoom };
    }
  };

  const onPointerMove = (e) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      setView((v) => clamp({ ...v, ox: v.ox + dx, oy: v.oy + dy }));
    } else if (pointers.current.size === 2 && pinch.current) {
      const zoom = (pinch.current.zoom * distance()) / pinch.current.d;
      setView((v) => clamp({ ...v, zoom }));
    }
  };

  const end = (e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };

  const onWheel = (e) => {
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setView((v) => clamp({ ...v, zoom: v.zoom * factor }));
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: end,
    onPointerCancel: end,
    onWheel,
  };
}
