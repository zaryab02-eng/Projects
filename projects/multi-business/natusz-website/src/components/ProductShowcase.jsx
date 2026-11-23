import { useCallback, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { useContent } from "../lib/content";
import { markHydrated } from "../lib/hydrated";

/**
 * Product cards plus the detail pop-up. Used on Home and Products.
 * Opening a product goes to /products/<slug>, so every medicine has its own shareable link.
 *  - scroll: on phones the cards sit in a row you swipe sideways (used on the Home page).
 *  - otherwise: a tidy grid, 2 cards across on phones, 3 on tablets, 4 on computers.
 */
export default function ProductShowcase({
  items,
  className = "",
  scroll = false,
}) {
  const { products } = useContent();
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const active = slug ? products.find((p) => p.slug === slug) || null : null;

  // Put the list back where it was after opening / closing a product.
  const y = location.state?.y;
  useEffect(() => {
    markHydrated();
    if (typeof y !== "number") return;
    const t = setTimeout(() => window.scrollTo(0, y), 80);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = useCallback(
    (p) => {
      const onProducts = location.pathname.startsWith("/products");
      const state = onProducts ? { y: window.scrollY } : undefined;
      if (onProducts)
        navigate(location.pathname + location.search, { replace: true, state });
      navigate(
        {
          pathname: `/products/${p.slug}`,
          search: onProducts ? location.search : "",
        },
        { state },
      );
    },
    [location.pathname, location.search, navigate],
  );

  const close = useCallback(() => {
    if (location.key !== "default") navigate(-1);
    else
      navigate(
        { pathname: "/products", search: location.search },
        { replace: true },
      );
  }, [location.key, location.search, navigate]);

  const layout = scroll
    ? "no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 pt-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-0 lg:grid-cols-4"
    : "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4";

  return (
    <>
      <div className={`${layout} ${className}`}>
        {items.map((p) =>
          scroll ? (
            <div key={p.id} className="w-[62%] shrink-0 snap-start sm:w-auto">
              <ProductCard product={p} onOpen={open} />
            </div>
          ) : (
            <ProductCard key={p.id} product={p} onOpen={open} />
          ),
        )}
      </div>
      <ProductModal product={active} onClose={close} />
    </>
  );
}
