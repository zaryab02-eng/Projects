import { LEAF_LEFT, LEAF_RIGHT, LEAF_CENTER, LEAF_INNER, DOT_BIG, DOT_SMALL } from "./logoPaths";

// Small Natusz symbol used as the "label" on the artwork
function Mark({ x, y, s = 0.2 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(-297 -346)`}>
      <path d={LEAF_RIGHT} fill="#059EA9" />
      <path d={LEAF_LEFT} fill="#059EA9" />
      <path d={LEAF_CENTER} fill="#059EA9" />
      <path d={LEAF_INNER} fill="#059EA9" />
      <path d={DOT_BIG} fill="#ED1C24" />
      <path d={DOT_SMALL} fill="#ED1C24" />
    </g>
  );
}

/**
 * Illustrated pack shot (jar, tube or bottle) tinted with the category colour.
 * If a product has an `image` it is shown instead. See src/data/products.js.
 */
export default function ProductVisual({ product, color = "#059EA9", className = "" }) {
  if (product.image) {
    return (
      <img src={product.image} alt={product.name} loading="lazy" className={`h-full w-full object-contain ${className}`} />
    );
  }

  const body = "#FFFFFF";
  const edge = "#CFE2E1";
  let art;

  if (product.visual === "jar") {
    art = (
      <>
        <rect x="52" y="112" width="96" height="86" rx="16" fill={body} stroke={edge} />
        <rect x="46" y="84" width="108" height="34" rx="10" fill="#062A2E" />
        <rect x="46" y="108" width="108" height="5" fill={color} />
        <Mark x="100" y="158" s={0.26} />
      </>
    );
  } else if (product.visual === "bottle") {
    art = (
      <>
        <rect x="92" y="42" width="30" height="14" rx="4" fill="#062A2E" />
        <rect x="90" y="52" width="20" height="26" rx="3" fill="#062A2E" />
        <path d="M110 54h24a4 4 0 0 1 4 4v3h-28z" fill="#062A2E" />
        <rect x="62" y="76" width="76" height="130" rx="18" fill={body} stroke={edge} />
        <rect x="62" y="76" width="76" height="22" rx="14" fill={color} opacity=".9" />
        <Mark x="100" y="148" s={0.26} />
      </>
    );
  } else {
    // tube, standing on its cap
    art = (
      <>
        <path d="M64 52h72l-8 6h-56z" fill="#062A2E" />
        <rect x="64" y="46" width="72" height="12" rx="3" fill="#062A2E" />
        <path d="M66 58h68l-6 132a6 6 0 0 1-6 6H78a6 6 0 0 1-6-6z" fill={body} stroke={edge} />
        <path d="M71 150h58l-1 40a6 6 0 0 1-6 6H78a6 6 0 0 1-6-6z" fill={color} opacity=".92" />
        <rect x="80" y="196" width="40" height="24" rx="5" fill="#062A2E" />
        <Mark x="100" y="106" s={0.26} />
      </>
    );
  }

  return (
    <svg viewBox="0 0 200 240" className={`h-full w-full ${className}`} role="img" aria-label={product.name}>
      <circle cx="100" cy="128" r="80" fill={color} opacity=".12" />
      <ellipse cx="100" cy="224" rx="52" ry="6" fill="#062A2E" opacity=".12" />
      {art}
    </svg>
  );
}
