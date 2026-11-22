import { useMemo, useState } from "react";
import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { Plus, Search, Star, EyeOff, X } from "lucide-react";
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

// Quick suggestions for the "details" list. The owner can also type any label of their own.
const SUGGESTIONS = ["Pack size", "Composition", "Form", "Price", "How to use"];

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
      className="flex h-full w-full items-center justify-center font-display text-2xl text-white"
      style={{ background: cat?.color || "#059EA9" }}
    >
      {p.name?.[0]?.toUpperCase() || "?"}
    </div>
  );
}

function ProductForm({ product, onClose, notify }) {
  const { siteId, categories } = useSite();
  const isNew = !product.id;
  const hasOthers = categories.some((c) => c.id === "others");
  const [f, setF] = useState({
    ...emptyProduct,
    category: categories[0]?.id || "others",
    ...product,
    details: detailsFromProduct(product),
  });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const setDetail = (i, k, v) =>
    setF((s) => ({
      ...s,
      details: s.details.map((d, j) => (j === i ? { ...d, [k]: v } : d)),
    }));
  const addDetail = (label = "") =>
    setF((s) => ({ ...s, details: [...s.details, { label, value: "" }] }));
  const removeDetail = (i) =>
    setF((s) => ({ ...s, details: s.details.filter((_, j) => j !== i) }));

  const usedLabels = f.details.map((d) => d.label.trim().toLowerCase());
  const freeSuggestions = SUGGESTIONS.filter(
    (s) => !usedLabels.includes(s.toLowerCase()),
  );

  const save = async () => {
    if (!f.name.trim()) return notify("Please enter the product name", "error");
    setBusy(true);
    try {
      let image = f.image;
      if (file)
        image = await uploadImage(file, {
          maxSize: 1200,
          folder: `${siteId}/products`,
        });
      const rows = f.details
        .map((d) => ({ label: d.label.trim(), value: d.value.trim() }))
        .filter((d) => d.label && d.value);
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
      notify(
        isNew
          ? "Product added. It is now live on the website."
          : "Changes saved",
      );
      onClose();
    } catch (e) {
      notify(friendlyError(e), "error");
      setBusy(false);
    }
  };

  const remove = async () => {
    if (
      !window.confirm(
        `Delete “${product.name}” from the website? This cannot be undone.`,
      )
    )
      return;
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
            {busy ? <Spinner /> : isNew ? "Add product" : "Save changes"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <Field
          label="Product photo"
          hint="Optional. Any photo shape works (wide, tall or square). The whole photo is kept."
        >
          <ImagePicker
            url={f.image}
            file={file}
            onPick={setFile}
            onClear={() => {
              setFile(null);
              setF((s) => ({ ...s, image: "" }));
            }}
            label="Take or choose a photo"
          />
        </Field>

        <Field label="Product name *">
          <input
            className="input"
            value={f.name}
            onChange={set("name")}
            placeholder="e.g. Hydra Moist Cream"
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
          />
        </Field>

        <div>
          <p className="mb-1 text-sm font-semibold">Product details</p>
          <p className="mb-3 text-xs text-ink/55">
            Add any details you want shown on the website, like pack size,
            composition or price. Tap a suggestion or make your own.
          </p>

          <div className="space-y-3">
            {f.details.map((d, i) => (
              <div key={i} className="flex items-start gap-2">
                <input
                  className="input w-2/5 shrink-0"
                  value={d.label}
                  onChange={(e) => setDetail(i, "label", e.target.value)}
                  placeholder="Name, e.g. Pack size"
                  aria-label="Detail name"
                />
                <textarea
                  className="input min-w-0 flex-1"
                  rows={1}
                  value={d.value}
                  onChange={(e) => setDetail(i, "value", e.target.value)}
                  placeholder="Value, e.g. 50 g"
                  aria-label="Detail value"
                />
                <button
                  type="button"
                  onClick={() => removeDetail(i)}
                  aria-label="Remove this detail"
                  className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink/50 transition hover:bg-mist hover:text-rose"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {freeSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addDetail(s)}
                className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink/70 transition active:scale-95"
              >
                + {s}
              </button>
            ))}
            <button
              type="button"
              onClick={() => addDetail("")}
              className="rounded-full border border-brand/40 bg-mist px-3 py-1.5 text-xs font-semibold text-brand-dark transition active:scale-95"
            >
              + My own detail
            </button>
          </div>
        </div>

        {!f.image && !file && (
          <Field label="Pack drawing (used when there is no photo)">
            <select className="input" value={f.visual} onChange={set("visual")}>
              <option value="tube">Tube</option>
              <option value="jar">Jar</option>
              <option value="bottle">Bottle</option>
            </select>
          </Field>
        )}

        <Switch
          checked={f.featured}
          onChange={(v) => setF((s) => ({ ...s, featured: v }))}
          label="Feature on home page"
          hint="The first 4 featured products appear on the Home page."
        />
        <Switch
          checked={f.visible !== false}
          onChange={(v) => setF((s) => ({ ...s, visible: v }))}
          label="Show on website"
          hint="Turn off to hide it without deleting."
        />
      </div>
    </Sheet>
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
  }, [items, query]);

  return (
    <div className="px-4 pb-32 pt-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          className="input rounded-full pl-11"
          type="search"
          placeholder={`Search ${items.length} products`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-rose/10 p-4 text-sm text-rose">
          {friendlyError(error)}
        </p>
      )}
      {loading && (
        <div className="mt-16 flex justify-center text-brand">
          <Spinner className="h-7 w-7" />
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <div className="mt-12 rounded-3xl border border-dashed border-ink/20 bg-white p-8 text-center">
          <h3 className="text-2xl">No products yet</h3>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink/60">
            Tap the + button to add your first product. Until then the website
            shows its built-in sample products.
          </p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink/60">
            Tip: Settings has a button to load the sample list so you can edit
            it.
          </p>
        </div>
      )}

      <ul className="mt-4 space-y-2.5">
        {filtered.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => setEditing(p)}
              className="flex w-full items-center gap-4 rounded-2xl border border-ink/10 bg-white p-3 text-left transition active:scale-[0.99]"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-mist">
                <Thumb p={p} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.name}</p>
                <p className="truncate text-sm text-ink/55">
                  {[catName(p.category), p.pack].filter(Boolean).join(", ")}
                </p>
                <div className="mt-1 flex gap-2 text-[11px] font-semibold">
                  {p.featured && (
                    <span className="flex items-center gap-1 text-brand-dark">
                      <Star className="h-3 w-3" /> Featured
                    </span>
                  )}
                  {p.visible === false && (
                    <span className="flex items-center gap-1 text-rose">
                      <EyeOff className="h-3 w-3" /> Hidden
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setEditing({})}
        aria-label="Add product"
        className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-rose text-white shadow-xl transition active:scale-95"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <Plus className="h-7 w-7" />
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
