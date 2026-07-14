import { Star } from 'lucide-react'
import { reviews, googleRating } from '@/data/reviews'
import { siteConfig } from '@/data/siteConfig'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

/**
 * Manually curated review screenshots — no live Google Reviews API.
 * See README "How to replace Google review screenshots" for the process
 * of swapping these images.
 */
export function Reviews() {
  return (
    <section id="reviews" className="py-28 sm:py-36 bg-iron">
      <div className="container-px">
        <SectionHeading eyebrow="Customer Reviews" title="Trusted by Hundreds of Customers" />

        <RevealOnScroll className="flex flex-col items-center gap-2 mb-14">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={22} className="fill-brass text-brass" />
            ))}
          </div>
          <p className="font-display text-2xl text-ivory">{googleRating.average} Google Rating</p>
          <p className="text-sm text-ash">Based on {googleRating.totalReviews}+ reviews</p>
          <a
            href={siteConfig.links.googleReviews}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost mt-4 !py-2.5 !px-6"
          >
            View on Google
          </a>
        </RevealOnScroll>

        {/* Horizontal scroll-snap carousel — swipeable on touch, draggable with a mouse wheel + shift */}
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory mask-fade-bottom [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="snap-center shrink-0 w-[280px] sm:w-[340px] card-surface overflow-hidden"
            >
              <img
                src={review.screenshot}
                alt={`Google review screenshot from ${review.customerName}`}
                loading="lazy"
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
