import { ArrowUpRight } from "lucide-react";
import ProductVisual from "./ProductVisual";
import WhatsAppIcon from "./WhatsAppIcon";
import { useContent } from "../lib/content";
import { productEnquiryLink } from "../lib/whatsapp";

// A detail named Price, MRP, Cost or Rate is shown in bold
const isPrice = (label) => /\b(price|mrp|cost|rate)\b/i.test(label || "");
// A plain number like 250 or 1,250 gets the rupee sign: ₹250. Anything else is left as typed.
const formatPrice = (v) => {
  const s = String(v).trim();
  return /^\d[\d,.]*\s*(\/-)?$/.test(s) ? `₹${s}` : s;
};

// Details the owner added in the admin app. Older products fall back to form / pack / composition.
function getDetails(p) {
  if (Array.isArray(p.details))
    return p.details.filter((d) => d && d.label && d.value);
  return [
    ["Form", p.form],
    ["Pack size", p.pack],
    ["Composition", p.composition],
  ]
    .filter(([, v]) => v)
    .map(([label, value]) => ({ label, value }));
}

export default function ProductCard({ product, onOpen }) {
  const { getCategory } = useContent();
  const cat = getCategory(product.category);

  // Short summary under the name: price first (if any), then other short details. Long ones stay in the pop-up.
  const short = getDetails(product).filter((d) => String(d.value).length <= 30);
  const price = short.find((d) => isPrice(d.label));
  const summary = (
    price ? [price, ...short.filter((d) => d !== price)] : short
  ).slice(0, 2);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(6,42,46,0.45)]">
      <a
        href={`/products/${product.slug}`}
        onClick={(e) => {
          if (
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey ||
            e.button !== 0
          )
            return;
          e.preventDefault();
          onOpen(product);
        }}
        className="relative block aspect-[5/5] w-full bg-mist text-left"
        aria-label={`View details of ${product.name}`}
      >
        <div
          className={`absolute inset-0 transition duration-500 group-hover:scale-[1.04] ${product.image ? "p-3" : "p-6"}`}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-contain"
            />
          ) : (
            <ProductVisual product={product} color={cat?.color} />
          )}
        </div>
        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink opacity-0 transition duration-300 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </a>

      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <p className="text-xs font-medium text-brand-dark">{cat?.name}</p>
        <h3 className="mt-1 font-display text-base leading-snug sm:mt-1.5 sm:text-xl">
          {product.name}
        </h3>
        {summary.length > 0 && (
          <p className="mt-1 truncate text-sm text-ink/60">
            {summary.map((d, i) => (
              <span key={`${d.label}-${i}`}>
                {i > 0 && ", "}
                <span className={isPrice(d.label) ? "font-bold text-ink" : ""}>
                  {isPrice(d.label) ? formatPrice(d.value) : d.value}
                </span>
              </span>
            ))}
          </p>
        )}
        <a
          href={productEnquiryLink(product, cat?.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full border border-ink/20 px-3 py-2 text-xs font-semibold text-ink transition duration-300 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white sm:mt-5 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Enquire<span className="hidden sm:inline"> on WhatsApp</span>
        </a>
      </div>
    </article>
  );
}
