import type { Product } from '@/types'

/**
 * Accessories Shop catalogue.
 * To add a product: append an object with a unique `id`. The Buy button
 * automatically builds a WhatsApp deep link using `name` and `price` —
 * no extra wiring needed. Price is in INR, stored as a plain number.
 */
export const products: Product[] = [
  {
    id: 'prod-01',
    name: 'Leather Gun Sling — Hand Stitched',
    category: 'Slings',
    price: 1499,
    image: 'https://picsum.photos/seed/product-sling/600/600',
    description: 'Full-grain leather sling, hand-stitched in-house with brass fittings.',
  },
  {
    id: 'prod-02',
    name: 'Premium Cleaning Kit',
    category: 'Cleaning Kits',
    price: 2199,
    image: 'https://picsum.photos/seed/product-cleaning-kit/600/600',
    description: 'Complete rod, brush and patch set for shotguns and rifles, in a walnut case.',
  },
  {
    id: 'prod-03',
    name: 'Canvas & Leather Gun Bag',
    category: 'Gun Bags',
    price: 3499,
    image: 'https://picsum.photos/seed/product-gunbag/600/600',
    description: 'Waxed canvas body with leather trim, padded interior, fits most shotguns.',
  },
  {
    id: 'prod-04',
    name: 'Field Leather Holster',
    category: 'Holsters',
    price: 1899,
    image: 'https://picsum.photos/seed/product-holster/600/600',
    description: 'Moulded leather holster with reinforced stitching and secure retention strap.',
  },
  {
    id: 'prod-05',
    name: 'Precision Gun Oil — 100ml',
    category: 'Gun Oils',
    price: 549,
    image: 'https://picsum.photos/seed/product-oil/600/600',
    description: 'Low-odour precision oil for actions, triggers and moving parts.',
  },
  {
    id: 'prod-06',
    name: 'Paper Target Pack (25)',
    category: 'Targets',
    price: 399,
    image: 'https://picsum.photos/seed/product-targets/600/600',
    description: 'Standard-grade range targets, pack of 25, high-visibility rings.',
  },
  {
    id: 'prod-07',
    name: 'Electronic Ear Protection',
    category: 'Ear Protection',
    price: 2799,
    image: 'https://picsum.photos/seed/product-ear/600/600',
    description: 'Sound-amplifying electronic earmuffs that suppress sudden loud noise.',
  },
  {
    id: 'prod-08',
    name: 'Shooting Glasses — Clear Lens',
    category: 'Eye Protection',
    price: 999,
    image: 'https://picsum.photos/seed/product-eye/600/600',
    description: 'Impact-resistant clear lens glasses with anti-fog coating.',
  },
  {
    id: 'prod-09',
    name: 'Padded Shooting Gloves',
    category: 'Gloves',
    price: 799,
    image: 'https://picsum.photos/seed/product-gloves/600/600',
    description: 'Breathable, padded-palm gloves for range days and workshop handling.',
  },
  {
    id: 'prod-10',
    name: 'Leather Cartridge Cap',
    category: 'Caps',
    price: 649,
    image: 'https://picsum.photos/seed/product-cap/600/600',
    description: 'Structured leather field cap with brass workshop emblem.',
  },
  {
    id: 'prod-11',
    name: 'Workshop Heritage Mug',
    category: 'Merchandise',
    price: 449,
    image: 'https://picsum.photos/seed/product-mug/600/600',
    description: 'Stoneware mug etched with the workshop\'s four-generation emblem.',
  },
  {
    id: 'prod-12',
    name: 'Embroidered Workshop Cap',
    category: 'Merchandise',
    price: 599,
    image: 'https://picsum.photos/seed/product-merch-cap/600/600',
    description: 'Cotton cap with embroidered brass-thread workshop crest.',
  },
]
