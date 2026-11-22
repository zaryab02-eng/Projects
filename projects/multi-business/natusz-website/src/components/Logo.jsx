import {
  LEAF_LEFT, LEAF_RIGHT, LEAF_CENTER, LEAF_INNER, DOT_BIG, DOT_SMALL,
  WORD_NATUSZ, WORD_HEALTHCARE,
} from "./logoPaths";

const TEAL = "#059EA9";
const RED = "#ED1C24";

/** Just the leaf-and-dots symbol. */
export function LogoMarkPaths() {
  return (
    <>
      <path d={LEAF_RIGHT} fill={TEAL} />
      <path d={LEAF_LEFT} fill={TEAL} />
      <path d={LEAF_CENTER} fill={TEAL} />
      <path d={LEAF_INNER} fill={TEAL} />
      <path d={DOT_BIG} fill={RED} />
      <path d={DOT_SMALL} fill={RED} />
    </>
  );
}


/** "Neu" (small) + Natusz wordmark + "Healthcare Pvt Ltd", as in the original logo. */
function Wordmark({ textColor }) {
  return (
    <>
      <text
        x="135.3"
        y="510"
        fill={RED}
        fontFamily="Manrope, Arial, sans-serif"
        fontWeight="700"
        fontSize="30"
        textLength="54"
        lengthAdjust="spacingAndGlyphs"
      >
        Neu
      </text>
      <path
        d={WORD_NATUSZ}
        fill={RED}
        transform="translate(197 511.2) scale(0.809) translate(-135.3 -511.2)"
      />
      <path d={WORD_HEALTHCARE} fill={textColor} />
    </>
  );
}

/**
 * Natusz logo.
 *  layout: "horizontal" (symbol + name side by side, used in the navbar)
 *          "stacked"    (symbol above the name, like the original artwork)
 *          "mark"       (symbol only)
 *  tone:   "dark" for light backgrounds, "light" for dark backgrounds
 */
export default function Logo({ layout = "horizontal", tone = "dark", className = "" }) {
  const textColor = tone === "light" ? "#F8FBFA" : "#231F20";

  if (layout === "mark") {
    return (
      <svg viewBox="200 272 195 148" className={className} role="img" aria-label="Natusz Healthcare">
        <LogoMarkPaths />
      </svg>
    );
  }

  if (layout === "stacked") {
    return (
      <svg viewBox="128 270 338 298" className={className} role="img" aria-label="Natusz Healthcare Pvt Ltd">
        <LogoMarkPaths />
        <Wordmark textColor={textColor} />
      </svg>
    );
  }

  // horizontal lockup: symbol on the left, name on the right
  return (
    <svg viewBox="0 0 525 128" className={className} role="img" aria-label="Natusz Healthcare Pvt Ltd">
      <g transform="scale(0.927) translate(-206.4 -277.7)">
        <LogoMarkPaths />
      </g>
      <g transform="translate(199 0) translate(-135 -437.5)">
        <Wordmark textColor={textColor} />
      </g>
    </svg>
  );
}
