import Logo from "./Logo";

/** Dark title band used at the top of the inner pages. */
export default function PageHeader({ title, intro }) {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="pointer-events-none absolute -right-16 top-1/2 w-[420px] -translate-y-1/2 opacity-[0.07] sm:w-[560px]">
        <Logo layout="mark" tone="light" className="h-auto w-full" />
      </div>
      <div className="container-x relative pb-14 pt-36 sm:pb-20 sm:pt-44">
        <h1 className="max-w-3xl text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">{title}</h1>
        {intro && <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/70 sm:text-lg">{intro}</p>}
      </div>
    </section>
  );
}
