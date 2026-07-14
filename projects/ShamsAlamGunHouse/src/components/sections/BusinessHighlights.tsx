import { useState } from 'react'
import { motion } from 'framer-motion'
import { businessStats } from '@/data/reviews'
import { useCountUp } from '@/hooks/useCountUp'
import type { StatItem } from '@/types'

function StatCounter({ stat, start }: { stat: StatItem; start: boolean }) {
  const value = useCountUp(stat.value, start)
  return (
    <div className="text-center">
      <p className="font-display text-4xl sm:text-5xl text-brass-light">
        {value.toLocaleString('en-IN')}
        {stat.suffix}
      </p>
      <p className="mt-3 font-mono text-xs uppercase tracking-widest2 text-ash">{stat.label}</p>
    </div>
  )
}

export function BusinessHighlights() {
  const [inView, setInView] = useState(false)

  return (
    <section className="py-24 sm:py-28 bg-charcoal border-y border-white/5">
      <motion.div
        onViewportEnter={() => setInView(true)}
        viewport={{ once: true, amount: 0.4 }}
        className="container-px grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6"
      >
        {businessStats.map((stat) => (
          <StatCounter key={stat.id} stat={stat} start={inView} />
        ))}
      </motion.div>
    </section>
  )
}
