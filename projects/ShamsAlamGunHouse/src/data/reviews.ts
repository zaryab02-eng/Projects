import type { Review, StatItem, WhyChooseUsItem } from '@/types'

/**
 * Manually curated Google review screenshots.
 * Drop screenshot images into `src/assets/reviews/` (see README) and
 * reference them here — there is no live Google Reviews API integration
 * by design (see the "Customer Reviews" section of the brief).
 */
export const reviews: Review[] = [
  { id: 'rev-01', screenshot: 'https://picsum.photos/seed/review-01/500/320', customerName: 'Rohit S.' },
  { id: 'rev-02', screenshot: 'https://picsum.photos/seed/review-02/500/320', customerName: 'Manpreet K.' },
  { id: 'rev-03', screenshot: 'https://picsum.photos/seed/review-03/500/320', customerName: 'Aditya V.' },
  { id: 'rev-04', screenshot: 'https://picsum.photos/seed/review-04/500/320', customerName: 'Farhan A.' },
  { id: 'rev-05', screenshot: 'https://picsum.photos/seed/review-05/500/320', customerName: 'Neha T.' },
]

export const googleRating = {
  average: 4.9,
  totalReviews: 320,
}

export const businessStats: StatItem[] = [
  { id: 'stat-years', label: 'Years of Experience', value: 66, suffix: '+' },
  { id: 'stat-repairs', label: 'Repairs Completed', value: 8400, suffix: '+' },
  { id: 'stat-restorations', label: 'Restorations Completed', value: 1250, suffix: '+' },
  { id: 'stat-customers', label: 'Happy Customers', value: 3600, suffix: '+' },
]

export const whyChooseUs: WhyChooseUsItem[] = [
  { id: 'why-01', title: 'Licensed Business', description: 'Fully licensed under the Arms Act, with every service documented and compliant.', icon: 'shield-check' },
  { id: 'why-02', title: 'Experienced Craftsmen', description: 'Four generations of hands-on expertise, passed down and continuously refined.', icon: 'wrench' },
  { id: 'why-03', title: 'Quality Workmanship', description: 'Every piece leaves the workshop inspected, tested, and finished to the same standard.', icon: 'sparkles' },
  { id: 'why-04', title: 'Genuine Parts', description: 'We use only genuine or precisely matched replacement parts — never substitutes.', icon: 'settings' },
  { id: 'why-05', title: 'Honest Pricing', description: 'Transparent, upfront quotes with no hidden charges before any work begins.', icon: 'droplets' },
  { id: 'why-06', title: 'Trusted by Customers', description: 'Hundreds of repeat customers across generations of their own families.', icon: 'crosshair' },
  { id: 'why-07', title: 'Attention to Detail', description: 'Every restoration is treated as if it were our own family heirloom.', icon: 'flame' },
  { id: 'why-08', title: 'Customer Satisfaction', description: 'We stand behind every job with clear communication from intake to pickup.', icon: 'trees' },
]
