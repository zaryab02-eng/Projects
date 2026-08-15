import { useEffect } from "react";
import { Star } from "lucide-react";
import { googleRating } from "@/data/reviews";
import { siteConfig } from "@/data/siteConfig";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function Reviews() {
  useEffect(() => {
    const scriptSrc =
      "https://widgets.sociablekit.com/google-reviews/widget.js";
    const globalKey = "sociablekitGoogleReviewsLoaded";

    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
    if (existingScript) {
      (window as typeof window & { [key: string]: boolean | undefined })[
        globalKey
      ] = true;
      return;
    }

    if (
      (window as typeof window & { [key: string]: boolean | undefined })[
        globalKey
      ]
    ) {
      return;
    }

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-sociablekit-widget", "google-reviews");
    script.onload = () => {
      (window as typeof window & { [key: string]: boolean | undefined })[
        globalKey
      ] = true;
    };
    document.body.appendChild(script);
  }, []);

  return (
    <section id="reviews" className="py-28 sm:py-36 bg-iron">
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

        <div className="w-full overflow-hidden rounded-xl">
          <div className="sk-ww-google-reviews" data-embed-id="25705644" />
        </div>
      </div>
    </section>
  );
}
