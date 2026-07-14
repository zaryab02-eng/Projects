import type { RestorationProject, RestorationCategory } from '@/types'

export const restorationCategories: RestorationCategory[] = [
  'All',
  'Antique Firearms',
  'Wooden Stocks',
  'Metal Refinishing',
  'Full Restoration',
]

/**
 * Before & after restoration projects.
 * To add a new project: append an object with a unique `id`, a
 * `beforeImage`/`afterImage` pair of the same aspect ratio, and a
 * category from `restorationCategories`.
 */
export const restorationProjects: RestorationProject[] = [
  {
    id: 'proj-01',
    title: "1962 Double-Barrel — Full Restoration",
    category: 'Full Restoration',
    beforeImage: 'https://picsum.photos/seed/restore-before-01/900/700',
    afterImage: 'https://picsum.photos/seed/restore-after-01/900/700',
    description:
      'A family heirloom shotgun, badly rusted after years of storage, brought back to full working condition.',
    workPerformed: ['Rust removal', 'Cold blueing', 'Stock refinishing', 'Action rebuild', 'Safety inspection'],
  },
  {
    id: 'proj-02',
    title: 'Vintage Bolt-Action — Stock Restoration',
    category: 'Wooden Stocks',
    beforeImage: 'https://picsum.photos/seed/restore-before-02/900/700',
    afterImage: 'https://picsum.photos/seed/restore-after-02/900/700',
    description: 'Cracked walnut stock repaired and hand-oiled back to a deep, even finish.',
    workPerformed: ['Crack repair', 'Hand sanding', 'Oil finishing', 'Checkering touch-up'],
  },
  {
    id: 'proj-03',
    title: 'Antique Percussion Rifle',
    category: 'Antique Firearms',
    beforeImage: 'https://picsum.photos/seed/restore-before-03/900/700',
    afterImage: 'https://picsum.photos/seed/restore-after-03/900/700',
    description: 'A 19th-century percussion rifle carefully conserved for a private collector.',
    workPerformed: ['Conservation cleaning', 'Metal stabilisation', 'Historical finish matching'],
  },
  {
    id: 'proj-04',
    title: 'Barrel Refinishing — Field Shotgun',
    category: 'Metal Refinishing',
    beforeImage: 'https://picsum.photos/seed/restore-before-04/900/700',
    afterImage: 'https://picsum.photos/seed/restore-after-04/900/700',
    description: 'Pitted barrel surface polished and hot-blued to a deep, uniform black.',
    workPerformed: ['Polishing', 'Hot blueing', 'Bore inspection'],
  },
  {
    id: 'proj-05',
    title: "Grandfather's Hunting Rifle",
    category: 'Full Restoration',
    beforeImage: 'https://picsum.photos/seed/restore-before-05/900/700',
    afterImage: 'https://picsum.photos/seed/restore-after-05/900/700',
    description: 'Three-generation family rifle restored for a customer\'s son\'s first licence.',
    workPerformed: ['Full teardown', 'Metal refinishing', 'Stock restoration', 'Scope remount'],
  },
  {
    id: 'proj-06',
    title: 'Engraved Presentation Piece',
    category: 'Antique Firearms',
    beforeImage: 'https://picsum.photos/seed/restore-before-06/900/700',
    afterImage: 'https://picsum.photos/seed/restore-after-06/900/700',
    description: 'Hand-engraved ceremonial firearm cleaned and conserved without disturbing the original artwork.',
    workPerformed: ['Conservation cleaning', 'Engraving preservation', 'Protective finishing'],
  },
]
