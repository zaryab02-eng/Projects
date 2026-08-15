import type { StatItem, WhyChooseUsItem } from "@/types";

/**
 * Real customer reviews (sourced from Google Reviews).
 * Each entry is text-based — rendered as a card in the Reviews section.
 * To add a new review, append an object with a unique id, customerName,
 * rating (1–5), and an optional text quote (omit text for a rating-only
 * review with no written comment).
 */
export const reviewScreenshots: { id: string; image: string; alt: string }[] = [
  {
    id: "rev-ss-01",
    image: "/reviews/review-01.png",
    alt: "Google review screenshot from a customer",
  },
  {
    id: "rev-ss-02",
    image: "/reviews/review-02.png",
    alt: "Google review screenshot from a customer",
  },
  {
    id: "rev-ss-03",
    image: "/reviews/review-03.png",
    alt: "Google review screenshot from a customer",
  },
  {
    id: "rev-ss-04",
    image: "/reviews/review-04.png",
    alt: "Google review screenshot from a customer",
  },
  {
    id: "rev-ss-05",
    image: "/reviews/review-05.png",
    alt: "Google review screenshot from a customer",
  },
  {
    id: "rev-ss-06",
    image: "/reviews/review-06.png",
    alt: "Google review screenshot from a customer",
  },
  {
    id: "rev-ss-07",
    image: "/reviews/review-07.png",
    alt: "Google review screenshot from a customer",
  },
  {
    id: "rev-ss-08",
    image: "/reviews/review-08.png",
    alt: "Google review screenshot from a customer",
  },
];
export const googleRating = {
  average: 5,
  totalReviews: 320,
};

export const businessStats: StatItem[] = [
  { id: "stat-years", label: "Years of Trust", value: 100, suffix: "+" },
  { id: "stat-repairs", label: "Repairs Completed", value: 12500, suffix: "+" },
  {
    id: "stat-restorations",
    label: "Restorations Completed",
    value: 1900,
    suffix: "+",
  },
  { id: "stat-customers", label: "Happy Customers", value: 5500, suffix: "+" },
];

export const whyChooseUs: WhyChooseUsItem[] = [
  {
    id: "why-01",
    title: "Licensed Business",
    description:
      "Fully licensed under the Arms Act, with every service documented and compliant.",
    icon: "shield-check",
  },
  {
    id: "why-02",
    title: "Experienced Craftsmen",
    description:
      "Four generations of hands-on expertise, passed down and continuously refined.",
    icon: "wrench",
  },
  {
    id: "why-03",
    title: "Quality Workmanship",
    description:
      "Every piece leaves the workshop inspected, tested, and finished to the same standard.",
    icon: "sparkles",
  },
  {
    id: "why-04",
    title: "Genuine Parts",
    description:
      "We use only genuine or precisely matched replacement parts — never substitutes.",
    icon: "settings",
  },
  {
    id: "why-05",
    title: "Honest Pricing",
    description:
      "Transparent, upfront quotes with no hidden charges before any work begins.",
    icon: "droplets",
  },
  {
    id: "why-06",
    title: "Trusted by Customers",
    description:
      "Hundreds of repeat customers across generations of their own families.",
    icon: "crosshair",
  },
  {
    id: "why-07",
    title: "Attention to Detail",
    description:
      "Every restoration is treated as if it were our own family heirloom.",
    icon: "flame",
  },
  {
    id: "why-08",
    title: "Customer Satisfaction",
    description:
      "We stand behind every job with clear communication from intake to pickup.",
    icon: "trees",
  },
];
