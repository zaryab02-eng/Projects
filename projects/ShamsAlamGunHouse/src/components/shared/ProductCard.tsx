import type { Product } from '@/types'
import { siteConfig } from '@/data/siteConfig'

interface ProductCardProps {
  product: Product
}

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/**
 * Product card for the Accessories Shop. The "Buy" button does not
 * process payments — it opens WhatsApp with the product name and price
 * pre-filled, per the brief. To wire up real checkout later, swap the
 * `href` below for your payment provider's link.
 */
export function ProductCard({ product }: ProductCardProps) {
  const message = `Hello, I'd like to buy: ${product.name} (${currencyFormatter.format(product.price)})`

  return (
    <div className="card-surface group overflow-hidden flex flex-col">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <span className="font-mono text-[11px] uppercase tracking-widest2 text-brass">{product.category}</span>
        <h3 className="font-display text-lg text-ivory mt-2 mb-1">{product.name}</h3>
        <p className="text-sm text-ash mb-4 flex-1">{product.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-mono text-base text-ivory">{currencyFormatter.format(product.price)}</span>
          <a
            href={siteConfig.contact.whatsappHref(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-widest2 text-iron bg-brass-gradient px-5 py-2.5 rounded-sm transition-transform hover:scale-105"
          >
            Buy
          </a>
        </div>
      </div>
    </div>
  )
}
