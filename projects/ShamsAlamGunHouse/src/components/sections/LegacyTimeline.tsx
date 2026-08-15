import { motion } from "framer-motion";
import { timeline } from "@/data/timeline";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

/**
 * The Family Legacy Timeline — the site's signature element.
 * The vertical brass rail with etched "plate" markers is styled after
 * the fluted groove of a rifled barrel, with each generation presented
 * as a brass plaque. Alternates left/right on desktop, single column
 * on mobile.
 */
export function LegacyTimeline() {
  const familyGroups = [
    timeline.slice(0, 2),
    timeline.slice(2, 4),
    timeline.slice(4, 6),
  ];

  return (
    <section
      id="legacy"
      className="relative py-28 sm:py-36 bg-iron overflow-hidden"
    >
      <div className="container-px">
        <SectionHeading
          eyebrow="The Family Legacy"
          title="Six Generations, One Family Line"
          description="From the first patriarch to the present generation, this is the story of one family line continuing the craft together."
        />
      </div>

      <div className="relative container-px max-w-5xl mx-auto">
        <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px lg:-translate-x-1/2 bg-gradient-to-b from-transparent via-gunmetal to-transparent" />

        <ol className="relative flex flex-col gap-16 lg:gap-20">
          {familyGroups.map((group, groupIndex) => {
            const isStacked = groupIndex === 0;

            return (
              <li key={`group-${groupIndex}`} className="relative">
                <div
                  className={`relative ${
                    isStacked
                      ? "mx-auto max-w-xl"
                      : "grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16"
                  }`}
                >
                  {group.map((gen, index) => {
                    const isEven = index % 2 === 0;

                    return (
                      <motion.div
                        key={gen.id}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.45, delay: index * 0.08 }}
                        className={`relative ${
                          isStacked ? "mb-6 last:mb-0" : ""
                        }`}
                      >
                        <motion.span
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{ duration: 0.5, ease: "backOut" }}
                          className="absolute left-6 lg:left-1/2 top-2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-brass-gradient ring-4 ring-iron shadow-brass z-10"
                        />

                        <RevealOnScroll
                          direction={isEven ? "left" : "right"}
                          delay={0.05}
                          className={`pl-16 lg:pl-0 ${
                            isStacked ? "max-w-xl" : ""
                          }`}
                        >
                          <div
                            className={`flex flex-col justify-center ${isStacked ? "w-full" : ""}`}
                          >
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
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
