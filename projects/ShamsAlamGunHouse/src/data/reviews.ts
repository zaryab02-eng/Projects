import type { Review, StatItem, WhyChooseUsItem } from "@/types";

/**
 * Real customer reviews (sourced from Google Reviews).
 * Each entry is text-based — rendered as a card in the Reviews section.
 * To add a new review, append an object with a unique id, customerName,
 * rating (1–5), and an optional text quote (omit text for a rating-only
 * review with no written comment).
 */
export const reviews: Review[] = [
  {
    id: "rev-01",
    customerName: "PUNIT CHAND",
    rating: 5,
    text: "Gorakhpur's best gun repairing shop",
  },
  {
    id: "rev-02",
    customerName: "Ashwani Singh",
    rating: 5,
    text: "Awesome and wonderful gun house",
  },
  {
    id: "rev-03",
    customerName: "Zia Sara",
    rating: 5,
    text: "Best gun shop in Gorakhpur",
  },
  {
    id: "rev-04",
    customerName: "mithilesh kumar",
    rating: 5,
    text: "गोरखपुर की सबसे अच्छी बंदूक की रिपेयरिंग होती है",
  },
  {
    id: "rev-05",
    customerName: "Raj kashyap",
    rating: 5,
    text: "Best and nyc guns",
  },
  {
    id: "rev-06",
    customerName: "Yasir Siddiqui",
    rating: 5,
    text: "Best shop with best work",
  },
  {
    id: "rev-07",
    customerName: "Diwakar Singh",
    rating: 5,
    text: "The best repair and refurbished of my Gun. This is the perfect shop for renew and make ur gun more attractive.",
  },
  {
    id: "rev-08",
    customerName: "Sameer Bhardwaj",
    rating: 5,
    text: "Best gun repair house in gorakhpur..... Or I think in purvanchal too...",
  },
  {
    id: "rev-09",
    customerName: "Brijesh Singh",
    rating: 5,
    text: "Super work 💯🔥",
  },
  {
    id: "rev-10",
    customerName: "Deepak Sahani",
    rating: 5,
    text: "excellent very good",
  },
  { id: "rev-11", customerName: "Shubham Rai", rating: 5, text: "Excellent" },
  {
    id: "rev-12",
    customerName: "Anitesh Rao",
    rating: 5,
    text: "Behad shandar",
  },
  {
    id: "rev-13",
    customerName: "ADITYA PANDEY",
    rating: 5,
    text: "Super exillent",
  },
  {
    id: "rev-14",
    customerName: "ANURAG SINGH (MICHAEL)",
    rating: 5,
    text: "Excellent 👍👍",
  },
  { id: "rev-15", customerName: "Harsh Shrivastava", rating: 5, text: "Best" },
  { id: "rev-16", customerName: "ambrish tiwari", rating: 5 },
  {
    id: "rev-17",
    customerName: "Sunny Chand",
    rating: 5,
    text: "Best repair shop of gun in Gorakhpur",
  },
  {
    id: "rev-18",
    customerName: "Naushad Alam",
    rating: 5,
    text: "Best Reparing centre In Gorakhpur",
  },
  {
    id: "rev-19",
    customerName: "Kamlesh Singh",
    rating: 5,
    text: "अल्हम्दुलिल्लाह बहुत ही बेहतरीन कार्य होता है!",
  },
  {
    id: "rev-20",
    customerName: "Tazak Reaan",
    rating: 5,
    text: "Best repairer in whole india 🔥",
  },
  {
    id: "rev-21",
    customerName: "ranjeet rai",
    rating: 5,
    text: "Very good gun house for repairing nd refurbishment of weapons ,",
  },
  {
    id: "rev-22",
    customerName: "योगेश प्रताप सिंह राष्ट्रीय संयोजक NSUI",
    rating: 5,
    text: "The best repairing shop of guns in Gorakhpur.",
  },
  {
    id: "rev-23",
    customerName: "Moqeem Siddiqui",
    rating: 5,
    text: "Excellent Gun Repairing Shop in Gorakhpur👍🏆",
  },
  {
    id: "rev-24",
    customerName: "vimlesh singh",
    rating: 5,
    text: "बहुत ही उम्दा कार्य होता है यहां पे बहुत ही शानदार",
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
