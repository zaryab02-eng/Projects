import { useCallback, useState } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

/** A grid of product cards plus the detail pop-up. Used on Home and Products. */
export default function ProductShowcase({ items, className = "" }) {
  const [active, setActive] = useState(null);
  const close = useCallback(() => setActive(null), []);
  return (
    <>
      <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
        {items.map((p) => (
          <ProductCard key={p.id} product={p} onOpen={setActive} />
        ))}
      </div>
      <ProductModal product={active} onClose={close} />
    </>
  );
}
