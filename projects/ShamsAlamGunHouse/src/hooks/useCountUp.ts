import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number from 0 to `target` once `start` becomes true.
 * Used by BusinessHighlights to animate stat counters when they
 * scroll into view.
 */
export function useCountUp(target: number, start: boolean, durationMs = 1800) {
  const [value, setValue] = useState(0)
  const frame = useRef<number>()
  const startTime = useRef<number>()

  useEffect(() => {
    if (!start) return

    const step = (timestamp: number) => {
      if (startTime.current === undefined) startTime.current = timestamp
      const elapsed = timestamp - startTime.current
      const progress = Math.min(elapsed / durationMs, 1)
      // Ease-out cubic for a natural deceleration toward the final number
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))

      if (progress < 1) {
        frame.current = requestAnimationFrame(step)
      } else {
        setValue(target)
      }
    }

    frame.current = requestAnimationFrame(step)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, target, durationMs])

  return value
}
