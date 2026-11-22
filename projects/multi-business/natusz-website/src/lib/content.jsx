import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db, firebaseReady, siteId } from "./firebase";
import {
  products as localProducts,
  categories as localCategories,
} from "../data/products";
import { galleryItems as localGallery } from "../data/gallery";
import { optimizeUrl } from "./images";

/**
 * Supplies products, categories and gallery photos to the whole site.
 *  - If the admin app has added content for this site (VITE_SITE_ID) to Firebase, that is used.
 *  - Otherwise (or if Firebase is not set up / offline) the built-in sample data in
 *    src/data/products.js and src/data/gallery.js is used.
 *
 * "Others": the admin app always lets the owner pick "Others" as a category. Any product whose
 * category is "others", or whose category no longer exists, is grouped under "Others".
 * The Others category only appears on the website when at least one product uses it.
 */
const ContentContext = createContext(null);

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);

const OTHERS = {
  id: "others",
  name: "Others",
  blurb: "More from our range.",
  color: "#059EA9",
};

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

async function loadCloud() {
  const base = ["sites", siteId];
  const [p, g, site] = await Promise.all([
    getDocs(collection(db, ...base, "products")),
    getDocs(collection(db, ...base, "gallery")),
    getDoc(doc(db, ...base)),
  ]);
  const products = p.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((x) => x.visible !== false && x.name)
    .sort(byOrder)
    .map((x) => ({
      ...x,
      details: Array.isArray(x.details) ? x.details : null,
      image: x.image ? optimizeUrl(x.image, 900) : "",
    }));
  const gallery = g.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((x) => x.src)
    .sort(byOrder)
    .map((x) => ({
      src: optimizeUrl(x.src, 1100),
      title: x.title || "Natusz Healthcare",
      description: x.description || "",
    }));
  const cats = site.exists() ? site.data().categories : null;
  return {
    products,
    gallery,
    categories: Array.isArray(cats) && cats.length ? cats : null,
  };
}

function build(products, galleryItems, categories) {
  const fixed = withOthers(products, categories);
  return {
    products: fixed.products,
    galleryItems,
    categories: fixed.categories,
    loaded: true,
  };
}

export function ContentProvider({ children }) {
  const [state, setState] = useState(() =>
    firebaseReady
      ? {
          products: [],
          galleryItems: [],
          categories: localCategories,
          loaded: false,
        }
      : build(localProducts, localGallery, localCategories),
  );

  useEffect(() => {
    if (!firebaseReady) return;
    let alive = true;
    const timeout = new Promise((_, rej) =>
      setTimeout(() => rej(new Error("timeout")), 7000),
    );
    Promise.race([loadCloud(), timeout])
      .then(({ products, gallery, categories }) => {
        if (!alive) return;
        setState(
          build(
            products.length ? products : localProducts,
            gallery.length ? gallery : localGallery,
            categories || localCategories,
          ),
        );
      })
      .catch(() => {
        if (alive)
          setState(build(localProducts, localGallery, localCategories));
      });
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      getCategory: (id) => state.categories.find((c) => c.id === id),
    }),
    [state],
  );
  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export const useContent = () => useContext(ContentContext);
