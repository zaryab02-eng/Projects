import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { db } from "../firebase";
import { useSite, slugify } from "../lib/site";
import useCollection from "../lib/useCollection";
import { Sheet, Spinner, friendlyError } from "./ui";

/** Edit the list of product categories for this website. */
export default function Categories({ onClose, notify }) {
  const { siteId, categories } = useSite();
  const { items: products } = useCollection("products");
  const [rows, setRows] = useState(categories.map((c) => ({ ...c })));
  const [busy, setBusy] = useState(false);

  const update = (i, patch) =>
    setRows((r) => r.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const move = (i, d) =>
    setRows((r) => {
      const next = [...r];
      const j = i + d;
      if (j < 0 || j >= next.length) return r;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const remove = (i) => {
    const c = rows[i];
    const used = c.id ? products.filter((p) => p.category === c.id).length : 0;
    if (used > 0)
      return notify(
        `${used} product(s) use “${c.name}”. Move them to another category first.`,
        "error",
      );
    setRows((r) => r.filter((_, j) => j !== i));
  };

  const save = async () => {
    if (rows.length === 0) return notify("Keep at least one category", "error");
    if (rows.some((r) => !r.name.trim()))
      return notify("Every category needs a name", "error");
    const taken = new Set(rows.filter((r) => r.id).map((r) => r.id));
    const out = rows.map((r) => {
      let id = r.id;
      if (!id) {
        const base = slugify(r.name) || "category";
        id = base;
        let n = 2;
        while (taken.has(id)) id = `${base}-${n++}`;
        taken.add(id);
      }
      return {
        id,
        name: r.name.trim(),
        blurb: (r.blurb || "").trim(),
        color: r.color || "#059EA9",
      };
    });
    setBusy(true);
    try {
      await setDoc(
        doc(db, "sites", siteId),
        { categories: out },
        { merge: true },
      );
      notify("Categories saved");
      onClose();
    } catch (e) {
      notify(friendlyError(e), "error");
      setBusy(false);
    }
  };

  const small =
    "flex h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-bold hover:bg-mist disabled:opacity-30";

  return (
    <Sheet
      title="Categories"
      onClose={busy ? () => {} : onClose}
      footer={
        <button onClick={save} disabled={busy} className="btn-primary w-full">
          {busy ? <Spinner /> : "Save"}
        </button>
      }
    >
      <div className="space-y-4">
        {rows.map((r, i) => (
          <div
            key={r.id || `new-${i}`}
            className="rounded-2xl border-2 border-ink/10 bg-white p-3"
          >
            <input
              className="input"
              placeholder="Category name"
              aria-label="Category name"
              value={r.name}
              onChange={(e) => update(i, { name: e.target.value })}
            />
            <input
              className="input mt-2"
              placeholder="Short description (optional)"
              aria-label="Short description"
              value={r.blurb || ""}
              onChange={(e) => update(i, { blurb: e.target.value })}
            />
            <div className="mt-2 flex flex-wrap items-center gap-1">
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className={small}
              >
                <ArrowUp className="h-4 w-4" /> Up
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === rows.length - 1}
                className={small}
              >
                <ArrowDown className="h-4 w-4" /> Down
              </button>
              <button
                onClick={() => remove(i)}
                className={`${small} ml-auto text-[#b4141a]`}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() =>
            setRows((r) => [
              ...r,
              { id: null, name: "", blurb: "", color: "#059EA9" },
            ])
          }
          className="btn-ghost w-full"
        >
          <Plus className="h-5 w-5" /> Add category
        </button>
      </div>
    </Sheet>
  );
}
