import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { site } from "../src/config/site.js";
import { withSlugs } from "../src/lib/slug.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadDotEnv() {
  const file = path.join(root, ".env");
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (line.trim().startsWith("#")) continue;
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = { ...loadDotEnv(), ...process.env };
const KEY = env.VITE_FIREBASE_API_KEY;
const PROJECT = env.VITE_FIREBASE_PROJECT_ID;
const SITE = env.VITE_SITE_ID;
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

function fromValue(v) {
  if (v == null) return null;
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("timestampValue" in v) return v.timestampValue;
  if ("arrayValue" in v) return (v.arrayValue.values || []).map(fromValue);
  if ("mapValue" in v) return fromFields(v.mapValue.fields || {});
  return null;
}
const fromFields = (f) =>
  Object.fromEntries(Object.entries(f).map(([k, v]) => [k, fromValue(v)]));

async function listDocs(col) {
  const out = [];
  let token = "";
  do {
    const url = `${BASE}/${col}?pageSize=300&key=${KEY}${token ? `&pageToken=${encodeURIComponent(token)}` : ""}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${col}: HTTP ${res.status}`);
    const j = await res.json();
    for (const d of j.documents || [])
      out.push({ id: d.name.split("/").pop(), ...fromFields(d.fields || {}) });
    token = j.nextPageToken || "";
  } while (token);
  return out;
}

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);
const snapFile = path.join(root, "src/data/snapshot.json");
let snapshot = { products: [], gallery: [], categories: null };
try {
  snapshot = JSON.parse(fs.readFileSync(snapFile, "utf8"));
} catch {
  /* keep empty */
}

async function main() {
  if (KEY && PROJECT && SITE) {
    try {
      const [p, g] = await Promise.all([
        listDocs(`sites/${SITE}/products`),
        listDocs(`sites/${SITE}/gallery`),
      ]);
      let categories = null;
      const r = await fetch(`${BASE}/sites/${SITE}?key=${KEY}`);
      if (r.ok) {
        const c = fromFields((await r.json()).fields || {}).categories;
        if (Array.isArray(c) && c.length) categories = c;
      }
      snapshot = {
        products: p.filter((x) => x.visible !== false && x.name).sort(byOrder),
        gallery: g.filter((x) => x.src).sort(byOrder),
        categories,
      };
      fs.writeFileSync(snapFile, JSON.stringify(snapshot));
      console.log(
        `[natusz] Saved ${snapshot.products.length} products for pre-rendering.`,
      );
    } catch (e) {
      console.warn(
        "[natusz] Could not fetch products, using the last saved copy:",
        e.message,
      );
    }
  } else {
    console.warn("[natusz] Firebase variables missing, using sample products.");
  }

  // Sitemap
  let names = snapshot.products;
  if (!names.length) {
    try {
      names = (await import("../src/data/products.js")).products || [];
    } catch {
      names = [];
    }
  }
  const today = new Date().toISOString().slice(0, 10);
  const urls = ["/", "/about", "/products", "/gallery", "/contact"].concat(
    withSlugs(names).map((p) => `/products/${p.slug}`),
  );
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url><loc>${site.url}${u === "/" ? "/" : u}</loc><lastmod>${today}</lastmod></url>`,
      )
      .join("\n") +
    `\n</urlset>\n`;
  fs.writeFileSync(path.join(root, "public/sitemap.xml"), xml);
  console.log(`[natusz] sitemap.xml written with ${urls.length} pages.`);
}

main().catch((e) => console.warn("[natusz] prebuild step skipped:", e.message));
