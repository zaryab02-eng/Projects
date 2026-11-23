import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import ProductShowcase from "../components/ProductShowcase";
import WhatsAppIcon from "../components/WhatsAppIcon";
import { useContent } from "../lib/content";
import { generalEnquiryLink, whatsappLink } from "../lib/whatsapp";
import { site } from "../config/site";

export default function Products() {
  const { products, categories, getCategory, loaded } = useContent();
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "all";
  const [query, setQuery] = useState(params.get("q") || "");
  const [sort, setSort] = useState("default");

  const setCategory = (id) => {
    const next = new URLSearchParams(params);
    if (id === "all") next.delete("category");
    else next.set("category", id);
    setParams(next, { replace: true });
  };

  const counts = useMemo(() => {
    const m = { all: products.length };
    categories.forEach(
      (c) => (m[c.id] = products.filter((p) => p.category === c.id).length),
    );
    return m;
  }, [products, categories]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      const hay = [
        p.name,
        p.form,
        p.composition,
        p.description,
        getCategory(p.category)?.name,
        ...(p.details || []).map((d) => d.value),
      ]
        .join(" ")
        .toLowerCase();
      return q.split(/\s+/).every((word) => hay.includes(word));
    });
    if (sort === "az")
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, query, category, sort, getCategory]);

  const activeCat = category !== "all" ? getCategory(category) : null;

  return (
    <>
      <PageHeader
        title="Our products"
        intro="Browse the range by category or search by name or ingredient. Tap WhatsApp on any product to ask us about it."
      />

      {/* Search + categories */}
      <div className="sticky top-[104px] z-30 lg:top-[72px] border-b border-ink/10 bg-paper/90 backdrop-blur-md">
        <div className="container-x py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="relative block md:w-[380px]">
              <span className="sr-only">Search products</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45" />
              <input
                type="search"
                inputMode="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or ingredient"
                className="w-full rounded-full border border-ink/15 bg-white py-3 pl-11 pr-11 text-sm outline-none transition placeholder:text-ink/40 focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink/50 transition hover:bg-mist hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>

            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-1 md:px-0">
              {[{ id: "all", name: "All" }, ...categories].map((c) => {
                const on = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    aria-pressed={on}
                    className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition duration-300 ${
                      on
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/15 bg-white text-ink/75 hover:border-ink/40"
                    }`}
                  >
                    {c.name}{" "}
                    <span className={on ? "text-paper/60" : "text-ink/40"}>
                      {counts[c.id]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <section className="py-8 sm:py-12">
        <div className="container-x">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-4xl">
                {activeCat ? activeCat.name : "All products"}
              </h2>
              <p className="mt-2 max-w-lg text-sm text-ink/60">
                {activeCat
                  ? activeCat.blurb
                  : "Everything in the Natusz range."}{" "}
                Showing {results.length}{" "}
                {results.length === 1 ? "product" : "products"}.
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm text-ink/60">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm text-ink outline-none focus:border-brand"
              >
                <option value="default">Recommended</option>
                <option value="az">Name, A to Z</option>
              </select>
            </label>
          </div>

          {!loaded ? (
            <p className="py-16 text-center text-sm text-ink/50">
              Loading products…
            </p>
          ) : results.length > 0 ? (
            <ProductShowcase items={results} />
          ) : (
            <div className="rounded-3xl border border-dashed border-ink/20 bg-white px-6 py-16 text-center">
              <h3 className="text-2xl">Nothing matches “{query}”</h3>
              <p className="mx-auto mt-3 max-w-md text-sm text-ink/60">
                Try a different word, or ask us directly. We may be able to help
                with a product that is not listed yet.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  className="btn-outline-dark"
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                  }}
                >
                  Clear filters
                </button>
                <a
                  href={whatsappLink(
                    `Hello ${site.name}, I am looking for "${query}". Could you help?`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ink"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Ask on WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="pb-14 sm:pb-20">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-mist px-6 py-8 sm:flex-row sm:items-center sm:px-10 sm:py-10">
            <div>
              <h3 className="text-xl sm:text-3xl">
                Need a bulk order or a product that is not listed?
              </h3>
              <p className="mt-2 text-sm text-ink/65">
                Tell us what you need and we will get back to you.
              </p>
            </div>
            <a
              href={generalEnquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ink shrink-0"
            >
              <WhatsAppIcon className="h-4 w-4" /> Message us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
