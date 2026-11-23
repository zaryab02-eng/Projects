import { useMemo, useState } from "react";
import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { Plus, Search, EyeOff, ChevronDown } from "lucide-react";
import { db } from "../firebase";
import { useSite } from "../lib/site";
import { uploadImage } from "../lib/upload";
import useCollection from "../lib/useCollection";
import {
  Sheet,
  Field,
  Switch,
  ImagePicker,
  Spinner,
  friendlyError,
  useConfirm,
} from "./ui";

const emptyProduct = {
  name: "",
  category: "",
  visual: "tube",
  description: "",
  featured: false,
  visible: true,
  image: "",
};

// Quick suggestions for the extra details. The owner can also type any label of their own.
const SUGGESTIONS = ["Pack size", "Composition", "Form", "How to use"];

const isPriceLabel = (l) => /^\s*price\s*$/i.test(l || "");

// Old products stored pack / form / composition as fixed fields. Turn them into detail rows.
function detailsFromProduct(p) {
  if (Array.isArray(p.details)) {
    return p.details.map((d) => ({
      label: d.label || "",
      value: d.value || "",
    }));
  }
  return [
    ["Pack size", p.pack],
    ["Form", p.form],
    ["Composition", p.composition],
  ]
    .filter(([, v]) => v && String(v).trim())
    .map(([label, value]) => ({ label, value }));
}

const money = (v) => {
  const s = String(v || "").trim();
  if (!s) return "";
  return /^\d[\d,.]*\s*(\/-)?$/.test(s) ? `₹${s}` : s;
};

function useCategoryName() {
  const { getCategory } = useSite();
  return (id) => getCategory(id)?.name || (id === "others" ? "Others" : "");
}

function Thumb({ p }) {
  const { getCategory } = useSite();
  const cat = getCategory(p.category);
  if (p.image)
    return (
      <img src={p.image} alt="" className="h-full w-full object-contain" />
    );
  return (
    <div
      className="flex h-full w-full items-center justify-center text-2xl font-bold text-white"
      style={{ background: cat?.color || "#059EA9" }}
    >
      {p.name?.[0]?.toUpperCase() || "?"}
    </div>
  );
}

function ProductForm({ product, onClose, notify }) {
  const { siteId, categories } = useSite();
  const [confirmNode, ask] = useConfirm();
  const isNew = !product.id;
  const hasOthers = categories.some((c) => c.id === "others");

  const all = detailsFromProduct(product);
  const priceRow = all.find((d) => isPriceLabel(d.label));
  const others = all.filter((d) => !isPriceLabel(d.label));

  const [price, setPrice] = useState(priceRow?.value || "");
  const [f, setF] = useState({
    ...emptyProduct,
    category: categories[0]?.id || "others",
    ...product,
    details: others,
  });
  const [more, setMore] = useState(others.length > 0);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const setDetail = (i, k, v) =>
    setF((s) => ({
      ...s,
      details: s.details.map((d, j) => (j === i ? { ...d, [k]: v } : d)),
    }));
  const addDetail = (label = "") => {
    setMore(true);
    setF((s) => ({ ...s, details: [...s.details, { label, value: "" }] }));
  };
  const removeDetail = (i) =>
    setF((s) => ({ ...s, details: s.details.filter((_, j) => j !== i) }));

  const usedLabels = f.details.map((d) => d.label.trim().toLowerCase());
  const freeSuggestions = SUGGESTIONS.filter(
    (s) => !usedLabels.includes(s.toLowerCase()),
  );
  const extraCount = f.details.filter((d) => d.value.trim()).length;

  const save = async () => {
    if (!f.name.trim()) return notify("Please type the product name", "error");
    setBusy(true);
    try {
      let image = f.image;
      if (file)
        image = await uploadImage(file, {
          maxSize: 1200,
          folder: `${siteId}/products`,
        });
      const rows = [
        ...(price.trim() ? [{ label: "Price", value: price.trim() }] : []),
        ...f.details.map((d) => ({
          label: d.label.trim(),
          value: d.value.trim(),
        })),
      ].filter((d) => d.label && d.value);
      const find = (re) => rows.find((d) => re.test(d.label))?.value || "";
      const data = {
        name: f.name.trim(),
        category: f.category,
        visual: f.visual,
        description: f.description.trim(),
        details: rows,
        // kept so older website code and search still work
        pack: find(/^pack/i),
        form: find(/^form$/i),
        composition: find(/^composition/i),
        featured: Boolean(f.featured),
        visible: f.visible !== false,
        image: image || "",
      };
      if (isNew) {
        await addDoc(collection(db, "sites", siteId, "products"), {
          ...data,
          order: Date.now(),
        });
      } else {
        await setDoc(doc(db, "sites", siteId, "products", product.id), data, {
          merge: true,
        });
      }
      notify(isNew ? "Product added. It is now on your website." : "Saved");
      onClose();
    } catch (e) {
      notify(friendlyError(e), "error");
      setBusy(false);
    }
  };

  const remove = async () => {
    const yes = await ask(
      `Delete “${product.name}” from your website? This cannot be undone.`,
    );
    if (!yes) return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, "sites", siteId, "products", product.id));
      notify("Product deleted");
      onClose();
    } catch (e) {
      notify(friendlyError(e), "error");
      setBusy(false);
    }
  };

  return (
    <>
      <Sheet
        title={isNew ? "New product" : "Edit product"}
        onClose={busy ? () => {} : onClose}
        footer={
          <div className="flex gap-3">
            {!isNew && (
              <button
                type="button"
                onClick={remove}
                disabled={busy}
                className="btn-danger"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="btn-primary flex-1"
            >
              {busy ? <Spinner /> : isNew ? "Add product" : "Save"}
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <Field
            label="Photo"
            hint="The whole photo is kept, nothing is cut off."
          >
            <ImagePicker
              url={f.image}
              file={file}
              onPick={setFile}
              onClear={() => {
                setFile(null);
                setF((s) => ({ ...s, image: "" }));
              }}
            />
          </Field>

          <Field label="Product name">
            <input
              className="input"
              value={f.name}
              onChange={set("name")}
              placeholder="e.g. Hydra Moist Cream"
            />
          </Field>

          <Field
            label="Price (₹)"
            hint="Just the number, like 250. Leave empty if you do not want to show a price."
          >
            <input
              className="input"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 250"
            />
          </Field>

          <Field label="Category">
            <select
              className="input"
              value={f.category}
              onChange={set("category")}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
              {!hasOthers && <option value="others">Others</option>}
            </select>
          </Field>

          <Field label="Short description">
            <textarea
              className="input"
              rows={3}
              value={f.description}
              onChange={set("description")}
              placeholder="One or two lines about this product"
            />
          </Field>

          <Switch
            checked={f.visible !== false}
            onChange={(v) => setF((s) => ({ ...s, visible: v }))}
            label="Show on website"
            hint="Turn off to hide it without deleting."
          />

          {/* Everything else lives here, so the main form stays short */}
          <div>
            <button
              type="button"
              onClick={() => setMore((m) => !m)}
              aria-expanded={more}
              className="flex w-full items-center justify-between rounded-2xl border-2 border-ink/20 bg-white px-4 py-4 text-left text-base font-bold"
            >
              <span>More details{extraCount ? ` (${extraCount})` : ""}</span>
              <ChevronDown
                className={`h-6 w-6 transition ${more ? "rotate-180" : ""}`}
              />
            </button>

            {more && (
              <div className="mt-4 space-y-5">
                <p className="text-sm text-ink/70">
                  Add pack size, composition or anything else people should
                  know. It is shown on the website.
                </p>

                {f.details.map((d, i) => (
                  <div
                    key={i}
                    className="space-y-2 rounded-2xl border-2 border-ink/10 bg-white p-3"
                  >
                    <input
                      className="input"
                      value={d.label}
                      onChange={(e) => setDetail(i, "label", e.target.value)}
                      placeholder="Name, e.g. Pack size"
                      aria-label="Detail name"
                    />
                    <textarea
                      className="input"
                      rows={2}
                      value={d.value}
                      onChange={(e) => setDetail(i, "value", e.target.value)}
                      placeholder="e.g. 50 g"
                      aria-label="Detail value"
                    />
                    <button
                      type="button"
                      onClick={() => removeDetail(i)}
                      className="h-11 rounded-xl px-2 text-sm font-bold text-[#b4141a]"
                    >
                      Remove this detail
                    </button>
                  </div>
                ))}

                <div className="flex flex-wrap gap-2">
                  {freeSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addDetail(s)}
                      className="min-h-[44px] rounded-full border-2 border-ink/20 bg-white px-4 text-sm font-bold"
                    >
                      + {s}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => addDetail("")}
                    className="min-h-[44px] rounded-full border-2 border-brand-dark bg-mist px-4 text-sm font-bold text-brand-dark"
                  >
                    + Other detail
                  </button>
                </div>

                <Switch
                  checked={f.featured}
                  onChange={(v) => setF((s) => ({ ...s, featured: v }))}
                  label="Show on home page"
                  hint="The first 4 chosen products appear on the Home page."
                />
              </div>
            )}
          </div>
        </div>
      </Sheet>
      {confirmNode}
    </>
  );
}

export default function Products({ notify }) {
  const catName = useCategoryName();
  const { items, loading, error } = useCollection("products");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) =>
      [
        p.name,
        p.composition,
        p.form,
        catName(p.category),
        ...(p.details || []).map((d) => d.value),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, query]);

  return (
    <div className="px-4 pb-40 pt-4">
      {items.length > 8 && (
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/50" />
          <input
            className="input pl-12"
            type="search"
            placeholder="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-2xl bg-[#b4141a] p-4 text-base font-semibold text-white">
          {friendlyError(error)}
        </p>
      )}
      {loading && (
        <div className="mt-16 flex justify-center text-brand-dark">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <div className="mt-10 rounded-3xl border-2 border-dashed border-ink/25 bg-white p-8 text-center">
          <h3 className="text-2xl">No products yet</h3>
          <p className="mx-auto mt-2 max-w-xs text-base text-ink/70">
            Tap <b>Add product</b> below to add your first one.
          </p>
        </div>
      )}

      {!loading && items.length > 0 && filtered.length === 0 && (
        <p className="mt-8 text-center text-base text-ink/70">
          Nothing found for “{query}”.
        </p>
      )}

      <ul className={`space-y-3 ${items.length > 8 ? "mt-4" : ""}`}>
        {filtered.map((p) => {
          const price = detailsFromProduct(p).find((d) =>
            isPriceLabel(d.label),
          )?.value;
          return (
            <li key={p.id}>
              <button
                onClick={() => setEditing(p)}
                className="flex w-full items-center gap-4 rounded-2xl border-2 border-ink/10 bg-white p-3 text-left transition active:scale-[0.99]"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-mist">
                  <Thumb p={p} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold leading-snug">{p.name}</p>
                  <p className="mt-0.5 truncate text-base text-ink/70">
                    {[money(price), catName(p.category)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {p.visible === false && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-[#b4141a]">
                      <EyeOff className="h-4 w-4" /> Hidden from website
                    </p>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        onClick={() => setEditing({})}
        className="fixed bottom-28 left-1/2 z-30 flex h-16 -translate-x-1/2 items-center gap-2 rounded-full bg-brand-dark px-8 text-lg font-bold text-white shadow-xl transition active:scale-95"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <Plus className="h-6 w-6" strokeWidth={2.6} /> Add product
      </button>

      {editing && (
        <ProductForm
          key={editing.id || "new"}
          product={editing}
          onClose={() => setEditing(null)}
          notify={notify}
        />
      )}
    </div>
  );
}
