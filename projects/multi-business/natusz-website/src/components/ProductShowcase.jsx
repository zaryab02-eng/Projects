import { useCallback, useState } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

/**
 * Product cards plus the detail pop-up. Used on Home and Products.
 *  - scroll: on phones the cards sit in a row you swipe sideways (used on the Home page).
 *  - otherwise: a tidy grid, 2 cards across on phones, 3 on tablets, 4 on computers.
 */
export default function ProductShowcase({
  items,
  className = "",
  scroll = false,
}) {
  const [active, setActive] = useState(null);
  const close = useCallback(() => setActive(null), []);

  const layout = scroll
    ? "no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 pt-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-0 lg:grid-cols-4"
    : "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4";

  return (
    <>
      <div className={`${layout} ${className}`}>
        {items.map((p) =>
          scroll ? (
            <div key={p.id} className="w-[62%] shrink-0 snap-start sm:w-auto">
              <ProductCard product={p} onOpen={setActive} />
            </div>
          ) : (
            <ProductCard key={p.id} product={p} onOpen={setActive} />
          ),
        )}
      </div>
      <ProductModal product={active} onClose={close} />
    </>
  );
}
