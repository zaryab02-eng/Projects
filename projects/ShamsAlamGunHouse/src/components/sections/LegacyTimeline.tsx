import { motion } from 'framer-motion'
import { timeline } from '@/data/timeline'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

/**
 * The Family Legacy Timeline — the site's signature element.
 * The vertical brass rail with etched "plate" markers is styled after
 * the fluted groove of a rifled barrel, with each generation presented
 * as a brass plaque. Alternates left/right on desktop, single column
 * on mobile.
 */
export function LegacyTimeline() {
  return (
    <section id="legacy" className="relative py-28 sm:py-36 bg-iron overflow-hidden">
      <div className="container-px">
        <SectionHeading
          eyebrow="The Family Legacy"
          title="Four Generations, One Workbench"
          description="Every tool in this workshop has passed through more than one pair of hands. Here is the line that shaped them."
        />
      </div>

      <div className="relative container-px max-w-5xl mx-auto">
        {/* Central rail */}
        <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px lg:-translate-x-1/2 bg-gradient-to-b from-transparent via-gunmetal to-transparent" />

        <ol className="relative flex flex-col gap-20 lg:gap-28">
          {timeline.map((gen, index) => {
            const isEven = index % 2 === 0
            return (
              <li key={gen.id} className="relative">
                {/* Brass rivet marker on the rail */}
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.5, ease: 'backOut' }}
                  className="absolute left-6 lg:left-1/2 top-2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-brass-gradient ring-4 ring-iron shadow-brass z-10"
                />

                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 pl-16 lg:pl-0 ${
                    isEven ? '' : 'lg:[direction:rtl]'
                  }`}
                >
                  <RevealOnScroll direction={isEven ? 'left' : 'right'} className="lg:[direction:ltr]">
                    <div className="overflow-hidden rounded-sm border border-white/5 shadow-soft aspect-[4/5] max-w-sm">
                      <img
                        src={gen.photo}
                        alt={`${gen.name}, ${gen.generationLabel}`}
                        loading="lazy"
                        className="h-full w-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                      />
                    </div>
                  </RevealOnScroll>

                  <RevealOnScroll
                    direction={isEven ? 'right' : 'left'}
                    delay={0.1}
                    className="lg:[direction:ltr] flex flex-col justify-center"
                  >
                    <span className="font-mono text-xs uppercase tracking-widest2 text-brass">
                      {gen.generationLabel} · {gen.years}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl text-ivory mt-3 mb-4">{gen.name}</h3>
                    <p className="body-copy mb-4">{gen.description}</p>
                    <div className="border-l-2 border-brass/40 pl-4">
                      <p className="text-sm text-ash italic">{gen.contribution}</p>
                    </div>
                  </RevealOnScroll>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
