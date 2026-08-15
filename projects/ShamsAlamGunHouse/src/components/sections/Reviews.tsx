import { useState } from "react";
import { Star, Quote } from "lucide-react";
import { reviews, googleRating } from "@/data/reviews";
import { siteConfig } from "@/data/siteConfig";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const INITIAL_COUNT = 9;

export function Reviews() {
  const [showAll, setShowAll] = useState(false);
  const visibleReviews = showAll ? reviews : reviews.slice(0, INITIAL_COUNT);
  const hasMore = reviews.length > INITIAL_COUNT;

  return (
    <section id="reviews" className="py-28 sm:py-36 bg-iron">
      <div className="container-px">
        <SectionHeading
          eyebrow="Customer Reviews"
          title="Trusted by Hundreds of Customers"
        />

        <RevealOnScroll className="flex flex-col items-center gap-2 mb-14">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleReviews.map((review, index) => (
            <RevealOnScroll
              key={review.id}
              direction="up"
              delay={(index % 3) * 0.08}
            >
              <div className="card-surface h-full p-6 sm:p-7 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        className={
                          i < review.rating
                            ? "fill-brass text-brass"
                            : "text-ash/30"
                        }
                      />
                    ))}
                  </div>
                  <Quote size={20} className="text-brass/25 shrink-0" />
                </div>

                <p className="text-sm sm:text-[15px] text-ash leading-relaxed flex-1">
                  {review.text ?? "5-star rating on Google."}
                </p>

                <p className="font-mono text-xs uppercase tracking-widest2 text-ivory pt-3 border-t border-white/10">
                  {review.customerName}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="btn-ghost !py-2.5 !px-6"
            >
              {showAll
                ? "Show Fewer Reviews"
                : `Show All ${reviews.length} Reviews`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
