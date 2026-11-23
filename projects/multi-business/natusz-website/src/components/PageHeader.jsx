import Logo from "./Logo";

/** Dark title band used at the top of the inner pages. */
export default function PageHeader({ title, intro }) {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="pointer-events-none absolute -right-16 top-1/2 w-[320px] -translate-y-1/2 opacity-[0.07] sm:w-[460px]">
        <Logo layout="mark" tone="light" className="h-auto w-full" />
      </div>
      <div className="container-x relative pb-10 pt-32 sm:pb-14 sm:pt-36 lg:pt-40">
        <h1 className="max-w-3xl text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-paper/70 sm:mt-5 sm:text-lg">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
