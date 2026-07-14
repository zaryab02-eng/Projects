import type { GalleryImage, GalleryCategory } from '@/types'

export const galleryCategories: GalleryCategory[] = [
  'Workshop',
  'Tools',
  'Restoration Process',
  'Repair Work',
  'Finished Projects',
  'Accessories',
]

export const galleryImages: GalleryImage[] = [
  { id: 'g-01', src: 'https://picsum.photos/seed/workshop-01/700/900', alt: 'Workbench in the workshop', category: 'Workshop' },
  { id: 'g-02', src: 'https://picsum.photos/seed/workshop-02/700/500', alt: 'Hand tools laid out on leather', category: 'Tools' },
  { id: 'g-03', src: 'https://picsum.photos/seed/workshop-03/700/900', alt: 'Craftsman polishing a barrel', category: 'Restoration Process' },
  { id: 'g-04', src: 'https://picsum.photos/seed/workshop-04/700/500', alt: 'Trigger mechanism repair in progress', category: 'Repair Work' },
  { id: 'g-05', src: 'https://picsum.photos/seed/workshop-05/700/900', alt: 'Finished restored shotgun on display', category: 'Finished Projects' },
  { id: 'g-06', src: 'https://picsum.photos/seed/workshop-06/700/500', alt: 'Leather gun case and cleaning kit', category: 'Accessories' },
  { id: 'g-07', src: 'https://picsum.photos/seed/workshop-07/700/900', alt: 'Rows of precision files and rasps', category: 'Tools' },
  { id: 'g-08', src: 'https://picsum.photos/seed/workshop-08/700/500', alt: 'Wooden stock being hand-sanded', category: 'Restoration Process' },
  { id: 'g-09', src: 'https://picsum.photos/seed/workshop-09/700/900', alt: 'Front facade of the workshop', category: 'Workshop' },
  { id: 'g-10', src: 'https://picsum.photos/seed/workshop-10/700/500', alt: 'Scope being mounted on a rifle', category: 'Repair Work' },
  { id: 'g-11', src: 'https://picsum.photos/seed/workshop-11/700/900', alt: 'Bluing tank in the metal finishing bay', category: 'Restoration Process' },
  { id: 'g-12', src: 'https://picsum.photos/seed/workshop-12/700/500', alt: 'Completed restoration lined up for pickup', category: 'Finished Projects' },
]
