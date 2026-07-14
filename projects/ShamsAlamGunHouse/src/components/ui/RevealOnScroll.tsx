import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealOnScrollProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  /** Slide in from a side instead of the default fade-up */
  direction?: 'up' | 'left' | 'right'
}

const directionOffsets: Record<NonNullable<RevealOnScrollProps['direction']>, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  left: { x: -40, y: 0 },
  right: { x: 40, y: 0 },
}

/**
 * Wraps any content in a fade + slide reveal that triggers once, when the
 * element scrolls into the viewport. This is the primary building block
 * for the site's "reveal on scroll" feel — used throughout every section.
 */
export function RevealOnScroll({
  children,
  delay = 0,
  className,
  direction = 'up',
}: RevealOnScrollProps) {
  const offset = directionOffsets[direction]

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
