/**
 * Central type definitions for Heritage Arms Co.
 * Keeping these in one file makes it easy to see the shape of every
 * content type the site renders, and keeps `data/*.ts` files honest.
 */

export interface TimelineGeneration {
  id: string
  generationLabel: string // e.g. "First Generation"
  name: string
  years: string // e.g. "1958 – 1979"
  photo: string
  description: string
  contribution: string
}

export interface Service {
  id: string
  title: string
  description: string
  /** lucide-react icon name, resolved in ServiceCard */
  icon: ServiceIconName
}

export type ServiceIconName =
  | 'wrench'
  | 'sparkles'
  | 'droplets'
  | 'flame'
  | 'trees'
  | 'shield-check'
  | 'crosshair'
  | 'settings'

export type RestorationCategory =
  | 'All'
  | 'Antique Firearms'
  | 'Wooden Stocks'
  | 'Metal Refinishing'
  | 'Full Restoration'

export interface RestorationProject {
  id: string
  title: string
  category: RestorationCategory
  beforeImage: string
  afterImage: string
  description: string
  workPerformed: string[]
}

export type GalleryCategory =
  | 'Workshop'
  | 'Tools'
  | 'Restoration Process'
  | 'Repair Work'
  | 'Finished Projects'
  | 'Accessories'

export interface GalleryImage {
  id: string
  src: string
  alt: string
  category: GalleryCategory
}

export type ProductCategory =
  | 'Caps'
  | 'Holsters'
  | 'Gun Bags'
  | 'Cleaning Kits'
  | 'Gun Oils'
  | 'Slings'
  | 'Targets'
  | 'Ear Protection'
  | 'Eye Protection'
  | 'Gloves'
  | 'Merchandise'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  price: number
  image: string
  description: string
}

export interface Review {
  id: string
  screenshot: string
  customerName: string
}

export interface StatItem {
  id: string
  label: string
  value: number
  suffix?: string
}

export interface WhyChooseUsItem {
  id: string
  title: string
  description: string
  icon: ServiceIconName
}
