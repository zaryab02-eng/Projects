/** Slow scrolling strip of words. Pauses on hover. */
export default function Marquee({ items }) {
  const row = [...items, ...items];
  return (
    <div className="marquee overflow-hidden" aria-hidden="true">
      <div className="marquee-track flex w-max items-center">
        {row.map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap font-display text-3xl italic text-deep sm:text-4xl">
            <span className="px-8">{t}</span>
            <span className="h-2 w-2 rounded-full bg-rose" />
          </span>
        ))}
      </div>
    </div>
  );
}
