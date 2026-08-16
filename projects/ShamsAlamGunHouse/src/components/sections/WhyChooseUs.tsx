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
import { whyChooseUs } from "@/data/reviews";
import { siteConfig } from "@/data/siteConfig";
import type { ServiceIconName } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

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

export function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-20 bg-iron">
      <div className="container-px">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="What Sets the Workshop Apart"
          description={`Reasons customers have trusted us for over ${siteConfig.trustYears} years — and keep coming back.`}
        />
      </div>

      <RevealOnScroll>
        <div className="w-full overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-4 sm:gap-5 px-6 sm:px-8 lg:px-12 xl:px-20">
            {whyChooseUs.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <div key={item.id} className="shrink-0 w-[240px] sm:w-[260px]">
                  <div className="flex flex-col items-start gap-4 p-2 h-full">
                    <div className="h-11 w-11 rounded-full border border-brass/40 flex items-center justify-center">
                      <Icon size={18} className="text-brass-light" />
                    </div>
                    <h3 className="font-display text-lg text-ivory">
                      {item.title}
                    </h3>
                    <p className="text-sm text-ash leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
