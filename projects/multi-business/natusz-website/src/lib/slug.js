export function slugify(s) {
  return (
    String(s || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "product"
  );
}

// Gives every product a unique, stable slug (same name twice becomes name-2).
export function withSlugs(list) {
  const used = new Set();
  return list.map((p) => {
    const base = slugify(p.name);
    let s = base;
    let i = 2;
    while (used.has(s)) s = `${base}-${i++}`;
    used.add(s);
    return { ...p, slug: s };
  });
}
