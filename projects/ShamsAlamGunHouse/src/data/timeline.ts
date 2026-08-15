import type { TimelineGeneration } from "@/types";

/**
 * The Family Legacy Timeline, in chronological order.
 * To add a new generation, append a new object to this array —
 * the LegacyTimeline component renders however many entries exist.
 */
export const timeline: TimelineGeneration[] = [
  {
    id: "gen-1",
    generationLabel: "First Generation",
    name: "Muhammad Sultan",
    years: "Late",
    photo: "/family/late-janab-sultan.jpg",
    description:
      "Late Muhammad Sultan served as a Head Instructor in the War Section around the 1940s and was respectfully known as an Engineer. He was the one who laid the foundation of our family’s craft, beginning a legacy of skill, dedication, and craftsmanship that continues to this day.",
    contribution:
      "Established the family’s legacy in the trade and became the first name in the line of dedicated craftsmanship.",
  },
  {
    id: "gen-2",
    generationLabel: "Second Generation",
    name: "Muhammad Shams Alam",
    years: "Late",
    photo: "/family/late-janam-shams-alam.jpg",
    description:
      "Late Muhammad Shams Alam, son of Late Muhammad Sultan, was one of the most distinguished craftsmen of his generation. Renowned for his exceptional skill, intelligence, and remarkable character, he carried forward the family’s tradition with extraordinary dedication and mastery. His work and conduct earned him lasting respect and established him as one of the finest figures in the family’s legacy.",
    contribution:
      "Carried the family tradition to new heights through exceptional craftsmanship, intelligence, and an unwavering commitment to excellence.",
  },
  {
    id: "gen-3",
    generationLabel: "Third Generation",
    name: "Mr. Muhammad Arhsad (Mony)",
    years: "Present",
    photo: "/family/mohd-arhsad-mony.jpg",
    description:
      "Mr. Muhammad Arshad (Mony), son of Late Muhammad Shams Alam, is the one who safeguarded and carried the family legacy forward. With the exceptional skill he inherited from his father, he earned immense respect through his craftsmanship, honesty, patience, and dedication. Known for never disappointing a customer, he built a reputation that stands proudly alongside the generations before him.",
    contribution:
      "Protected and elevated the family legacy through exceptional craftsmanship, earning lasting respect and trust from generations of customers.",
  },
  {
    id: "gen-4",
    generationLabel: "Third Generation",
    name: "Mr. Muhammad Imran",
    years: "Present",
    photo: "/family/mohd-imran.jpg",
    description:
      "A key part of the same family lane, contributing to the craft and carrying the same legacy forward with pride.",
    contribution:
      "Worked alongside the family in the same lineage, preserving the values and strengthening the path ahead for the next generation.",
  },
  {
    id: "gen-5",
    generationLabel: "Fourth Generation",
    name: "Mr. Muhammad Altamash",
    years: "Present",
    photo: "/family/mohd-altamash.jpg",
    description:
      "Standing in the same family lane, sharing the same roots and the same responsibility to preserve the craft.",
    contribution:
      "Represents the next chapter of the family story, growing with the legacy and keeping the line moving forward together.",
  },
];
