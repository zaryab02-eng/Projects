import { useCallback, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { MoveHorizontal } from 'lucide-react'

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  altText: string
}

/**
 * Draggable / touch-friendly before-after image comparison slider.
 * Works with mouse drag, touch drag, and keyboard (arrow keys) once
 * the handle is focused, for accessibility.
 */
export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  altText,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50) // percentage
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, pct)))
  }, [])

  const onPointerDown = () => {
    dragging.current = true
  }
  const onPointerUp = () => {
    dragging.current = false
  }
  const onPointerMove = (e: PointerEvent) => {
    if (!dragging.current) return
    updateFromClientX(e.clientX)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPosition((p) => Math.max(0, p - 5))
    if (e.key === 'ArrowRight') setPosition((p) => Math.min(100, p + 5))
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-sm select-none touch-none"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* After image (base layer, fully visible) */}
      <img
        src={afterImage}
        alt={`${altText} — after restoration`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Before image, clipped to the slider position via clip-path so it
          never needs to know the container's pixel width */}
      <img
        src={beforeImage}
        alt={`${altText} — before restoration`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        draggable={false}
      />

      {/* Labels */}
      <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest2 bg-iron/70 text-ivory px-3 py-1.5 rounded-sm backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-widest2 bg-iron/70 text-brass-light px-3 py-1.5 rounded-sm backdrop-blur-sm">
        {afterLabel}
      </span>

      {/* Divider + handle */}
      <div className="absolute inset-y-0 bg-brass-light/80 w-0.5" style={{ left: `${position}%` }} />
      <button
        type="button"
        aria-label="Drag to compare before and after"
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        style={{ left: `${position}%` }}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-brass-gradient shadow-brass flex items-center justify-center cursor-ew-resize"
      >
        <MoveHorizontal size={18} className="text-iron" />
      </button>
    </div>
  )
}
