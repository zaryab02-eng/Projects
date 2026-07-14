import { Wrench, Sparkles, Droplets, Flame, Trees, ShieldCheck, Crosshair, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { services } from '@/data/services'
import type { ServiceIconName } from '@/types'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

/** Maps the string icon names stored in data/services.ts to actual lucide components. */
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

export function Services() {
  return (
    <section id="services" className="py-28 sm:py-36 bg-iron">
      <div className="container-px">
        <SectionHeading
          eyebrow="What We Do"
          title="Services, Performed to One Standard"
          description="From routine servicing to full restoration, every job is handled by the same hands and held to the same standard."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon]
            return (
              <RevealOnScroll key={service.id} delay={(i % 4) * 0.08}>
                <div className="card-surface p-8 h-full flex flex-col">
                  <div className="h-12 w-12 rounded-sm bg-brass/10 border border-brass/30 flex items-center justify-center mb-6">
                    <Icon size={22} className="text-brass-light" />
                  </div>
                  <h3 className="font-display text-xl text-ivory mb-2">{service.title}</h3>
                  <p className="text-sm text-ash leading-relaxed">{service.description}</p>
                </div>
              </RevealOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}
