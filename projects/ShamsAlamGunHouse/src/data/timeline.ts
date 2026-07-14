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
    name: 'Late Ram Prasad Verma',
    years: '1958 – 1979',
    photo: 'https://picsum.photos/seed/heritage-gen1/600/720',
    description:
      'A trained armourer who apprenticed under a British-era gunsmith before founding the workshop in 1958.',
    contribution:
      'Established the workshop\'s reputation for precision barrel work and laid down the hand-tool discipline the family still follows today.',
  },
  {
    id: 'gen-2',
    generationLabel: 'Second Generation',
    name: 'Late Suresh Verma',
    years: '1979 – 2004',
    photo: 'https://picsum.photos/seed/heritage-gen2/600/720',
    description:
      'Took over the workshop at 22 and expanded it from barrel repair into full restoration of antique and heirloom firearms.',
    contribution:
      'Introduced wooden stock restoration and cold-blueing services, and formalised the workshop\'s licence under the Arms Act, 1959.',
  },
  {
    id: 'gen-3',
    generationLabel: 'Third Generation',
    name: 'Vinod Verma & Anil Verma',
    years: '2004 – Present',
    photo: 'https://picsum.photos/seed/heritage-gen3/600/720',
    description:
      'Brothers who trained together and modernised the workshop with precision measuring tools while preserving hand-finishing techniques.',
    contribution:
      'Built long-term relationships with collectors and licence holders across the state, and mentored the fourth generation from childhood.',
  },
  {
    id: 'gen-4',
    generationLabel: 'Fourth Generation',
    name: 'Arjun Verma & Karan Verma',
    years: '2018 – Present',
    photo: 'https://picsum.photos/seed/heritage-gen4/600/720',
    description:
      'Brothers carrying the workshop forward, combining formal training in metallurgy with decades of family technique.',
    contribution:
      'Introduced digital record-keeping, safety inspection protocols, and brought the family\'s craft online for the first time.',
  },
]
