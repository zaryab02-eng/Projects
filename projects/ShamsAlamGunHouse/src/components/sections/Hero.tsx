import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'
import { LinkButton } from '@/components/ui/Button'

/**
 * Full-bleed cinematic hero. Replace the background image URL below with
 * a real workshop photograph (see README "How to replace images").
 */
export function Hero() {
  return (
    <section id="home" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url('https://picsum.photos/seed/workshop-hero/1800/1200')` }}
      />
      {/* Dark cinematic overlay */}
      <div className="absolute inset-0 bg-iron/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-iron via-iron/40 to-iron/60" />
      <div className="absolute inset-0 bg-vignette" />

      <div className="relative h-full flex flex-col items-center justify-center text-center container-px">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="eyebrow mb-6"
        >
          Est. {siteConfig.establishedYear} — Four Generations of Craft
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium text-ivory text-balance max-w-4xl"
        >
          {siteConfig.shopName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-5 font-mono text-sm sm:text-base uppercase tracking-widest2 text-brass-light"
        >
          {siteConfig.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75 }}
          className="mt-6 max-w-xl body-copy text-base sm:text-lg text-balance"
        >
          {siteConfig.heroSubline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <LinkButton href="#contact" variant="primary">
            Book a Service
          </LinkButton>
          <LinkButton href="#restorations" variant="ghost">
            Explore Our Work
          </LinkButton>
        </motion.div>
      </div>

      <motion.a
        href="#legacy"
        aria-label="Scroll to next section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.4, duration: 0.8 }, y: { repeat: Infinity, duration: 2, ease: 'easeInOut' } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ash hover:text-brass-light transition-colors"
      >
        <ChevronDown size={28} />
      </motion.a>
    </section>
  )
}
