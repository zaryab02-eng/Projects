import { useMemo, useState } from 'react'
import { products } from '@/data/products'
import type { ProductCategory } from '@/types'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { ProductCard } from '@/components/shared/ProductCard'

const allCategories = Array.from(new Set(products.map((p) => p.category))) as ProductCategory[]

export function AccessoriesShop() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'All'>('All')

  const filtered = useMemo(
    () => (activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory)),
    [activeCategory],
  )

  return (
    <section id="shop" className="py-28 sm:py-36 bg-charcoal">
      <div className="container-px">
        <SectionHeading
          eyebrow="Accessories Shop"
          title="Field-Ready Gear"
          description="Every accessory we stock is legal for civilian purchase in India. Tap Buy to order via WhatsApp — no online payment required."
        />

        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {(['All', ...allCategories] as const).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`font-mono text-xs uppercase tracking-widest2 px-5 py-2.5 rounded-sm border transition-colors ${
                activeCategory === category
                  ? 'border-brass bg-brass/10 text-brass-light'
                  : 'border-white/10 text-ash hover:border-brass/40 hover:text-ivory'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <RevealOnScroll key={product.id} delay={(i % 4) * 0.08}>
              <ProductCard product={product} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
