import {
  Wrench,
  Sparkles,
  Droplets,
  Flame,
  Trees,
  ShieldCheck,
  Crosshair,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { services } from "@/data/services";
import type { ServiceIconName } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

/** Maps the string icon names stored in data/services.ts to actual lucide components. */
const iconMap: Record<ServiceIconName, LucideIcon> = {
  wrench: Wrench,
  sparkles: Sparkles,
  droplets: Droplets,
  flame: Flame,
  trees: Trees,
  "shield-check": ShieldCheck,
  crosshair: Crosshair,
  settings: Settings,
};

export function Services() {
  return (
    <section id="services" className="py-16 sm:py-20 bg-iron">
      <div className="container-px">
        <SectionHeading
          eyebrow="What We Do"
          title="Services, Performed to One Standard"
          description="From routine servicing to full restoration, every job is handled by the same hands and held to the same standard."
        />
      </div>

      <RevealOnScroll>
        <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 px-6 sm:px-10 lg:px-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))] snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-x-contain">
          {services.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <div
                key={service.id}
                className="shrink-0 w-[260px] sm:w-[280px] snap-start"
              >
                <div className="card-surface p-6 h-full flex flex-col">
                  <div className="h-11 w-11 rounded-sm bg-brass/10 border border-brass/30 flex items-center justify-center mb-5">
                    <Icon size={20} className="text-brass-light" />
                  </div>
                  <h3 className="font-display text-lg text-ivory mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-ash leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </RevealOnScroll>
    </section>
  );
}
