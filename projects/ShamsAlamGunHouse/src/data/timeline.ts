import type { TimelineGeneration } from '@/types'

/**
 * The Family Legacy Timeline, in chronological order.
 * To add a fifth generation, append a new object to this array —
 * the LegacyTimeline component renders however many entries exist.
 */
export const timeline: TimelineGeneration[] = [
  {
    id: 'gen-1',
    generationLabel: 'First Generation',
    name: 'Late Janab Sultan',
    years: '—',
    photo: '/family/late-janab-sultan.jpg',
    description:
      'The original family patriarch whose values, discipline, and craft set the foundation for generations to follow.',
    contribution:
      'Established the family’s legacy in the trade and became the first name in the line of dedicated craftsmanship.',
  },
  {
    id: 'gen-2',
    generationLabel: 'Second Generation',
    name: 'Late Janam Shams Alam',
    years: '—',
    photo: '/family/late-janam-shams-alam.jpg',
    description:
      'The next keeper of the family tradition, carrying forward the reputation and skill of the lineage.',
    contribution:
      'Protected the family name and passed on the practical knowledge and work ethic that shaped the generations after him.',
  },
  {
    id: 'gen-3',
    generationLabel: 'Third Generation',
    name: 'Mohd Arhsad (Mony)',
    years: 'Present',
    photo: '/family/mohd-arhsad-mony.jpg',
    description:
      'A guiding hand in the family craft, building on the legacy with commitment, patience, and technical skill.',
    contribution:
      'Continued the tradition with steady leadership and made sure the family craft remained rooted in discipline and trust.',
  },
  {
    id: 'gen-4',
    generationLabel: 'Fourth Generation',
    name: 'Mohd Imran',
    years: 'Present',
    photo: '/family/mohd-imran.jpg',
    description:
      'A key part of the same family lane, contributing to the craft and carrying the same legacy forward with pride.',
    contribution:
      'Worked alongside the family in the same lineage, preserving the values and strengthening the path ahead for the next generation.',
  },
  {
    id: 'gen-5',
    generationLabel: 'Fifth Generation',
    name: 'Mohd Zaryab',
    years: 'Present',
    photo: '/family/mohd-zaryab.jpg',
    description:
      'Continuing the journey with passion, focus, and a deep respect for the family’s craft and heritage.',
    contribution:
      'Carrying the family tradition forward while learning, refining, and building on the lessons passed down through the generations.',
  },
  {
    id: 'gen-6',
    generationLabel: 'Sixth Generation',
    name: 'Mohd Altamash',
    years: 'Present',
    photo: '/family/mohd-altamash.jpg',
    description:
      'Standing in the same family lane, sharing the same roots and the same responsibility to preserve the craft.',
    contribution:
      'Represents the next chapter of the family story, growing with the legacy and keeping the line moving forward together.',
  },
]
