import { motion } from "framer-motion";
import { timeline } from "@/data/timeline";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

/**
 * The Family Legacy Timeline — the site's signature element.
 * Groups: [Gen 1, Gen 2] side by side, [Arshad, Imran] side by side,
 * then the youngest generation alone, centered, at the end.
 */
export function LegacyTimeline() {
  const familyGroups = [
    { entries: timeline.slice(0, 2), centered: false },
    { entries: timeline.slice(2, 4), centered: false },
    { entries: timeline.slice(4, 5), centered: true },
  ];

  return (
    <section
      id="legacy"
      className="relative py-16 sm:py-20 bg-iron overflow-hidden"
    >
      <div className="container-px">
        <SectionHeading
          eyebrow="The Family Legacy"
          title="Generations, One Family Line"
          description="From the first patriarch to the present generation, this is the story of one family line continuing the craft together."
        />
      </div>

      <div className="relative container-px max-w-5xl mx-auto mt-16">
        <ol className="flex flex-col gap-16 lg:gap-24">
          {familyGroups.map((group, groupIndex) => (
            <li key={`group-${groupIndex}`}>
              <div
                className={
                  group.centered
                    ? "grid grid-cols-1 max-w-md mx-auto"
                    : "grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:gap-12"
                }
              >
                {group.entries.map((gen, index) => (
                  <motion.div
                    key={gen.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                  >
                    <RevealOnScroll direction="up" delay={0.05}>
                      <div className="flex flex-col justify-center h-full">
                        <span className="font-mono text-xs uppercase tracking-widest2 text-brass">
                          {gen.generationLabel} · {gen.years}
                        </span>
                        <h3 className="font-signature text-3xl sm:text-4xl text-brass-light mt-3 mb-4 font-bold italic tracking-wide leading-none">
                          {gen.name}
                        </h3>
                        <p className="body-copy mb-4">{gen.description}</p>
                        <div className="border-l-2 border-brass/40 pl-4">
                          <p className="text-sm text-ash italic">
                            {gen.contribution}
                          </p>
                        </div>
                      </div>
                    </RevealOnScroll>
                  </motion.div>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
