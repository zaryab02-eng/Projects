// ─────────────────────────────────────────────────────────────
//  PRODUCTS: add, edit or delete products here.
//
//  ⚠ These are SAMPLE entries so the site looks complete.
//  Replace them with the real product list from Ahmed
//  (names, pack sizes, compositions, descriptions).
//
//  Each product:
//    id           unique, lowercase, no spaces
//    name         product name shown on the card
//    category     one of the category ids below
//    form         Cream, Gel, Lotion, Serum, Wash, Shampoo ...
//    visual       "tube" | "jar" | "bottle" (artwork shown until you add a photo)
//    pack         pack size, e.g. "50 g" or "100 ml"
//    composition  key ingredients / composition
//    description  one or two short lines
//    featured     true = shows on the Home page
//    image        (optional) path to a real photo, e.g. "/products/hydra-cream.jpg"
//                 Put the file in the /public/products/ folder.
// ─────────────────────────────────────────────────────────────

export const categories = [
  {
    id: "moisturisers",
    name: "Moisturisers & Emollients",
    blurb: "Everyday hydration and barrier support for dry, sensitive skin.",
    color: "#059EA9",
  },
  {
    id: "sun-care",
    name: "Sun Care",
    blurb: "Broad-spectrum protection that sits lightly on Indian skin tones.",
    color: "#E0A526",
  },
  {
    id: "acne-care",
    name: "Acne & Oil Control",
    blurb: "Clearer, calmer skin without stripping it dry.",
    color: "#0A3C42",
  },
  {
    id: "cleansers",
    name: "Cleansers & Face Wash",
    blurb: "Gentle daily cleansing for every skin type.",
    color: "#4FB3BF",
  },
  {
    id: "brightening",
    name: "Brightening & Pigmentation",
    blurb: "Targeted care for uneven tone and dull skin.",
    color: "#ED1C24",
  },
  {
    id: "hair-scalp",
    name: "Hair & Scalp Care",
    blurb: "Scalp comfort and stronger-looking hair.",
    color: "#7A5C3E",
  },
];

export const products = [
  // ── Moisturisers & Emollients ──
  {
    id: "hydra-moist-cream",
    name: "Hydra Moist Cream",
    category: "moisturisers",
    form: "Cream",
    visual: "jar",
    pack: "100 g",
    composition: "Ceramide, Hyaluronic acid, Glycerin",
    description: "A rich daily cream that keeps dry skin soft and comfortable.",
    featured: true,
  },
  {
    id: "dermacalm-lotion",
    name: "Dermacalm Emollient Lotion",
    category: "moisturisers",
    form: "Lotion",
    visual: "bottle",
    pack: "200 ml",
    composition: "Liquid paraffin, Glycerin, Shea butter",
    description: "A light, fast-absorbing lotion for the whole body.",
  },
  {
    id: "barrier-repair-balm",
    name: "Barrier Repair Balm",
    category: "moisturisers",
    form: "Balm",
    visual: "tube",
    pack: "50 g",
    composition: "Ceramide NP, Panthenol, Squalane",
    description: "A soothing balm for rough, cracked or irritated patches.",
  },

  // ── Sun Care ──
  {
    id: "sunveil-spf50-gel",
    name: "SunVeil SPF 50 Gel",
    category: "sun-care",
    form: "Gel",
    visual: "tube",
    pack: "50 g",
    composition: "Broad-spectrum UVA/UVB filters, Vitamin E",
    description: "A weightless, non-greasy gel sunscreen for daily use.",
    featured: true,
  },
  {
    id: "sunveil-tinted-spf40",
    name: "SunVeil Tinted Mineral SPF 40",
    category: "sun-care",
    form: "Cream",
    visual: "tube",
    pack: "50 g",
    composition: "Zinc oxide, Titanium dioxide, Iron oxides",
    description: "A mineral sunscreen with a soft tint that blends in.",
  },
  {
    id: "sunveil-kids-spf30",
    name: "SunVeil Kids SPF 30 Lotion",
    category: "sun-care",
    form: "Lotion",
    visual: "bottle",
    pack: "100 ml",
    composition: "Zinc oxide, Allantoin, Aloe vera",
    description: "A gentle, fragrance-free lotion made for young skin.",
  },

  // ── Acne & Oil Control ──
  {
    id: "clearmatte-gel",
    name: "ClearMatte Gel",
    category: "acne-care",
    form: "Gel",
    visual: "tube",
    pack: "20 g",
    composition: "Salicylic acid, Niacinamide",
    description: "An oil-free gel that keeps pores clear and skin matte.",
    featured: true,
  },
  {
    id: "clearmatte-spot",
    name: "ClearMatte Spot Care",
    category: "acne-care",
    form: "Gel",
    visual: "tube",
    pack: "15 g",
    composition: "Sulphur, Zinc oxide, Aloe vera",
    description: "A targeted overnight treatment for stubborn spots.",
  },
  {
    id: "sebo-balance-serum",
    name: "Sebo Balance Serum",
    category: "acne-care",
    form: "Serum",
    visual: "bottle",
    pack: "30 ml",
    composition: "Niacinamide, Zinc PCA",
    description: "Helps regulate shine and refine the look of pores.",
  },

  // ── Cleansers ──
  {
    id: "purely-gentle-wash",
    name: "Purely Gentle Face Wash",
    category: "cleansers",
    form: "Wash",
    visual: "bottle",
    pack: "100 ml",
    composition: "Mild surfactants, Glycerin, Panthenol",
    description: "A soap-free cleanser that leaves skin soft, never tight.",
    featured: true,
  },
  {
    id: "foaming-acne-wash",
    name: "Foaming Acne Wash",
    category: "cleansers",
    form: "Wash",
    visual: "bottle",
    pack: "100 ml",
    composition: "Salicylic acid 2%, Zinc PCA",
    description: "A deep-cleansing foam for oily and acne-prone skin.",
  },
  {
    id: "soothe-body-wash",
    name: "Soothe Body Wash",
    category: "cleansers",
    form: "Wash",
    visual: "bottle",
    pack: "250 ml",
    composition: "Oat extract, Glycerin, Ceramide",
    description: "A creamy body wash for dry, easily irritated skin.",
  },

  // ── Brightening ──
  {
    id: "lumina-serum",
    name: "Lumina Brightening Serum",
    category: "brightening",
    form: "Serum",
    visual: "bottle",
    pack: "30 ml",
    composition: "Vitamin C, Ferulic acid, Vitamin E",
    description: "A daily antioxidant serum for a brighter, more even look.",
  },
  {
    id: "lumina-night-cream",
    name: "Lumina Night Cream",
    category: "brightening",
    form: "Cream",
    visual: "jar",
    pack: "50 g",
    composition: "Tranexamic acid, Niacinamide, Alpha arbutin",
    description: "An overnight cream that supports an even skin tone.",
  },
  {
    id: "even-tone-gel",
    name: "Even Tone Spot Gel",
    category: "brightening",
    form: "Gel",
    visual: "tube",
    pack: "20 g",
    composition: "Azelaic acid, Niacinamide",
    description: "A lightweight gel for marks and uneven patches.",
  },

  // ── Hair & Scalp ──
  {
    id: "scalp-calm-shampoo",
    name: "Scalp Calm Shampoo",
    category: "hair-scalp",
    form: "Shampoo",
    visual: "bottle",
    pack: "100 ml",
    composition: "Zinc pyrithione, Piroctone olamine",
    description: "A soothing shampoo for flaky, itchy scalps.",
    featured: false,
  },
  {
    id: "root-strength-serum",
    name: "Root Strength Serum",
    category: "hair-scalp",
    form: "Serum",
    visual: "bottle",
    pack: "60 ml",
    composition: "Redensyl, Biotin, Caffeine",
    description: "A leave-on scalp serum for stronger-looking hair.",
  },
  {
    id: "nourish-hair-mask",
    name: "Nourish Hair Mask",
    category: "hair-scalp",
    form: "Mask",
    visual: "jar",
    pack: "200 g",
    composition: "Keratin, Argan oil, Panthenol",
    description: "A deep conditioning mask for dry, damaged hair.",
  },
];

export const getCategory = (id) => categories.find((c) => c.id === id);
