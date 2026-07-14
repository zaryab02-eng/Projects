import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { siteConfig } from "@/data/siteConfig";

const pillars = [
  {
    label: "Family Tradition",
    copy: "Four generations under one roof, one ledger, and one name.",
  },
  {
    label: "Experience",
    copy: `Over ${new Date().getFullYear() - siteConfig.establishedYear} years of hands-on craft, refined daily.`,
  },
  {
    label: "Skilled Craftsmanship",
    copy: "Hand tools and trained eyes, not assembly-line shortcuts.",
  },
  {
    label: "Attention to Detail",
    copy: "Every screw, seam, and finish checked before it leaves the bench.",
  },
];

export function AboutUs() {
  return (
    <section id="about" className="py-28 sm:py-36 bg-charcoal">
      <div className="container-px grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <RevealOnScroll direction="left">
          <div className="relative">
            <div className="overflow-hidden rounded-sm shadow-soft aspect-[4/5] max-w-md">
              <img
                src="https://picsum.photos/seed/about-workshop/700/875"
                alt="Craftsman at work inside the Sham's Alam Gun House workshop"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="hidden sm:block absolute -bottom-8 -right-8 glass-panel rounded-sm p-6 max-w-[220px] shadow-brass">
              <p className="font-display text-3xl text-brass-light">
                {new Date().getFullYear() - siteConfig.establishedYear}+
              </p>
              <p className="text-xs text-ash mt-1 uppercase tracking-widest2 font-mono">
                Years of Trust
              </p>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll direction="right" delay={0.1}>
          <span className="eyebrow">About the Workshop</span>
          <h2 className="section-heading mt-4 mb-6 text-balance">
            Built on trust, refined by hand, carried forward with care.
          </h2>
          <p className="body-copy mb-4">
            {siteConfig.shopName} began in {siteConfig.establishedYear} as a
            single workbench and a promise: every firearm that came through the
            door would be treated like family property, because to us, it often
            was.
          </p>
          <p className="body-copy mb-8">
            Six decades on, that promise hasn't changed. We are a licensed,
            family-run workshop where craftsmanship is taught at the bench, not
            in a manual — and where every repair, restoration, and inspection is
            carried out with the same discipline that built our name.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.label}
                className="border-l-2 border-brass/40 pl-4"
              >
                <p className="font-display text-lg text-ivory">
                  {pillar.label}
                </p>
                <p className="text-sm text-ash mt-1">{pillar.copy}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
