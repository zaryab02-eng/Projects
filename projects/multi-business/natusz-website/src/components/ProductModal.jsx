import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import ProductVisual from "./ProductVisual";
import WhatsAppIcon from "./WhatsAppIcon";
import { useContent } from "../lib/content";
import { productEnquiryLink } from "../lib/whatsapp";
import { isHydrated } from "../lib/hydrated";

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

export default function ProductModal({ product, onClose }) {
  const { getCategory } = useContent();
  const closeRef = useRef(null);
  const cat = product ? getCategory(product.category) : null;
  // On the very first render (the pre-rendered HTML) the pop-up is drawn in place so search
  // engines can read it. Right after, and always on later opens, it moves to the page body.
  const [portal, setPortal] = useState(isHydrated);
  useEffect(() => setPortal(true), []);

  useEffect(() => {
    if (!product) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  const rows = [
    ["Category", cat?.name],
    ...getDetails(product).map((d) => [d.label, d.value]),
  ].filter(([, v]) => v);

  const node = (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* This box does not scroll, so the close button always stays visible. Only the content inside scrolls. */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-t-3xl bg-paper sm:rounded-3xl">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow transition hover:bg-ink hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid max-h-[92dvh] overflow-y-auto overscroll-contain md:grid-cols-2">
          <div
            className={`bg-mist ${product.image ? "p-5 sm:p-8" : "p-8 sm:p-12"}`}
          >
            <div
              className={`mx-auto aspect-square w-full ${product.image ? "max-w-[400px]" : "max-w-[320px]"}`}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <ProductVisual product={product} color={cat?.color} />
              )}
            </div>
          </div>

          <div className="flex flex-col p-7 sm:p-10">
            <p className="text-sm font-medium text-brand-dark">{cat?.name}</p>
            <h2 className="mt-2 pr-8 text-3xl leading-tight sm:text-4xl">
              {product.name}
            </h2>
            {product.description && (
              <p className="mt-4 leading-relaxed text-ink/70">
                {product.description}
              </p>
            )}

            <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10 text-sm">
              {rows.map(([k, v], i) => (
                <div
                  key={`${k}-${i}`}
                  className="grid grid-cols-[110px_1fr] gap-3 py-3"
                >
                  <dt
                    className={
                      isPrice(k) ? "font-semibold text-ink" : "text-ink/50"
                    }
                  >
                    {k}
                  </dt>
                  <dd
                    className={`whitespace-pre-line break-words ${isPrice(k) ? "text-base font-bold" : "font-medium"}`}
                  >
                    {isPrice(k) ? formatPrice(v) : v}
                  </dd>
                </div>
              ))}
            </dl>

            <a
              href={productEnquiryLink(product, cat?.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-95"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Enquire on WhatsApp
            </a>
            <p className="mt-3 text-xs text-ink/50">
              Availability and details are shared on request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return portal ? createPortal(node, document.body) : node;
}
