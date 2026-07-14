import { Wrench, Sparkles, Droplets, Flame, Trees, ShieldCheck, Crosshair, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { whyChooseUs } from '@/data/reviews'
import type { ServiceIconName } from '@/types'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

const iconMap: Record<ServiceIconName, LucideIcon> = {
  wrench: Wrench,
  sparkles: Sparkles,
  droplets: Droplets,
  flame: Flame,
  trees: Trees,
  'shield-check': ShieldCheck,
  crosshair: Crosshair,
  settings: Settings,
}

export function WhyChooseUs() {
  return (
    <section className="py-28 sm:py-36 bg-iron">
      <div className="container-px">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="What Sets the Workshop Apart"
          description="Reasons customers have trusted us for over six decades — and keep coming back."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUs.map((item, i) => {
            const Icon = iconMap[item.icon]
            return (
              <RevealOnScroll key={item.id} delay={(i % 4) * 0.07}>
                <div className="flex flex-col items-start gap-4 p-2">
                  <div className="h-11 w-11 rounded-full border border-brass/40 flex items-center justify-center">
                    <Icon size={18} className="text-brass-light" />
                  </div>
                  <h3 className="font-display text-lg text-ivory">{item.title}</h3>
                  <p className="text-sm text-ash leading-relaxed">{item.description}</p>
                </div>
              </RevealOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}
