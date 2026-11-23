import snapshot from "../data/snapshot.json";
import {
  products as localProducts,
  categories as localCategories,
} from "../data/products";
import { galleryItems as localGallery } from "../data/gallery";
import { optimizeUrl } from "./images";
import { withSlugs } from "./slug";

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);

const OTHERS = {
  id: "others",
  name: "Others",
  blurb: "More from our range.",
  color: "#059EA9",
};

export function normalizeProducts(raw = []) {
  return raw
    .filter((x) => x.visible !== false && x.name)
    .sort(byOrder)
    .map((x) => ({
      ...x,
      details: Array.isArray(x.details) ? x.details : null,
      image: x.image ? optimizeUrl(x.image, 900) : "",
    }));
}

export function normalizeGallery(raw = []) {
  return raw
    .filter((x) => x.src)
    .sort(byOrder)
    .map((x) => ({
      src: optimizeUrl(x.src, 1100),
      title: x.title || "Neu Natusz Healthcare",
      description: x.description || "",
    }));
}

function withOthers(products, categories) {
  const known = new Set(categories.map((c) => c.id));
  const fixed = products.map((p) =>
    known.has(p.category) || p.category === "others"
      ? p
      : { ...p, category: "others" },
  );
  const needOthers = fixed.some((p) => p.category === "others");
  const hasOthers = categories.some((c) => c.id === "others");
  return {
    products: fixed,
    categories: needOthers && !hasOthers ? [...categories, OTHERS] : categories,
  };
}

export function buildContent(products, galleryItems, categories) {
  const fixed = withOthers(products, categories);
  return {
    products: withSlugs(fixed.products),
    galleryItems,
    categories: fixed.categories,
    loaded: true,
  };
}

// Content saved at build time (see scripts/fetch-content.mjs). Null if there is none.
export function snapshotContent() {
  const products = normalizeProducts(snapshot.products || []);
  if (!products.length) return null;
  const gallery = normalizeGallery(snapshot.gallery || []);
  const cats =
    Array.isArray(snapshot.categories) && snapshot.categories.length
      ? snapshot.categories
      : localCategories;
  return buildContent(products, gallery.length ? gallery : localGallery, cats);
}

export function buildTimeContent() {
  return (
    snapshotContent() ||
    buildContent(localProducts, localGallery, localCategories)
  );
}
