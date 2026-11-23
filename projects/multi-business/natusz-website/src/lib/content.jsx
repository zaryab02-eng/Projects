import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db, firebaseReady, siteId } from "./firebase";
import {
  products as localProducts,
  categories as localCategories,
} from "../data/products";
import { galleryItems as localGallery } from "../data/gallery";
import {
  buildContent,
  normalizeGallery,
  normalizeProducts,
  snapshotContent,
} from "./catalog";

/**
 * Supplies products, categories and gallery photos to the whole site.
 *  - At build time a copy of the admin app's content is saved (scripts/fetch-content.mjs)
 *    so the pre-rendered HTML already contains the products.
 *  - In the browser, the live content from Firebase replaces it straight away.
 *  - If Firebase is empty or unreachable, the built-in samples are used.
 */
const ContentContext = createContext(null);

async function loadCloud() {
  const base = ["sites", siteId];
  const [p, g, site] = await Promise.all([
    getDocs(collection(db, ...base, "products")),
    getDocs(collection(db, ...base, "gallery")),
    getDoc(doc(db, ...base)),
  ]);
  const cats = site.exists() ? site.data().categories : null;
  return {
    products: normalizeProducts(p.docs.map((d) => ({ id: d.id, ...d.data() }))),
    gallery: normalizeGallery(g.docs.map((d) => ({ id: d.id, ...d.data() }))),
    categories: Array.isArray(cats) && cats.length ? cats : null,
  };
}

function initialState() {
  const snap = snapshotContent();
  if (snap) return snap;
  if (!firebaseReady || typeof window === "undefined")
    return buildContent(localProducts, localGallery, localCategories);
  return {
    products: [],
    galleryItems: [],
    categories: localCategories,
    loaded: false,
  };
}

export function ContentProvider({ children }) {
  const [state, setState] = useState(initialState);

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
          buildContent(
            products.length ? products : localProducts,
            gallery.length ? gallery : localGallery,
            categories || localCategories,
          ),
        );
      })
      .catch(() => {
        if (alive)
          setState((s) =>
            s.loaded
              ? s
              : buildContent(localProducts, localGallery, localCategories),
          );
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
