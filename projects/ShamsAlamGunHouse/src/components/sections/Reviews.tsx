import { Star } from "lucide-react";
import { reviewScreenshots, googleRating } from "@/data/reviews";
import { siteConfig } from "@/data/siteConfig";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function Reviews() {
  return (
    <section id="reviews" className="py-16 sm:py-20 bg-iron">
      <div className="container-px">
        <SectionHeading
          eyebrow="Customer Reviews"
          title="Trusted by Hundreds of Customers"
        />

        <RevealOnScroll className="flex flex-col items-center gap-2 mb-8">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={22} className="fill-brass text-brass" />
            ))}
          </div>
          <p className="font-display text-2xl text-ivory">
            {googleRating.average} Google Rating
          </p>
          <p className="text-sm text-ash">
            Based on {googleRating.totalReviews}+ reviews
          </p>
          <a
            href={siteConfig.links.googleReviews}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost mt-4 !py-2.5 !px-6"
          >
            View on Google
          </a>
        </RevealOnScroll>
      </div>

      <RevealOnScroll>
        <div className="flex gap-5 sm:gap-6 overflow-x-auto pb-6 px-6 sm:px-10 lg:px-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))] snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-x-contain">
          {reviewScreenshots.map((shot) => (
            <div
              key={shot.id}
              className="shrink-0 w-[78vw] xs:w-[340px] sm:w-[300px] lg:w-[320px] snap-start"
            >
              <div className="card-surface overflow-hidden">
                <img
                  src={shot.image}
                  alt={shot.alt}
                  loading="lazy"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}
