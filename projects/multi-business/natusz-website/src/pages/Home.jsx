import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Droplets,
  Sun,
  ShieldCheck,
  Waves,
  Sparkles,
  Leaf,
  Stethoscope,
  FlaskConical,
  MessageCircle,
  BookOpenCheck,
} from "lucide-react";
import BloomMark from "../components/BloomMark";
import Marquee from "../components/Marquee";
import ScrollWords from "../components/ScrollWords";
import ProductShowcase from "../components/ProductShowcase";
import WhatsAppIcon from "../components/WhatsAppIcon";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { onReady } from "../lib/ready";
import { useContent } from "../lib/content";
import { site } from "../config/site";
import { generalEnquiryLink } from "../lib/whatsapp";
import Seo from "../components/Seo";

const icons = {
  moisturisers: Droplets,
  "sun-care": Sun,
  "acne-care": ShieldCheck,
  cleansers: Waves,
  brightening: Sparkles,
  "hair-scalp": Leaf,
};

// ── Home page copy lives here, edit freely ──
const statement =
  "Natusz is a new name in skin care, built by a team with years in the field alongside doctors and chemists, who know what they ask of a product.";

const principles = [
  {
    Icon: Stethoscope,
    title: "Chosen with doctors in mind",
    text: "Every product is selected for how it performs in the clinic, not only how it looks on the shelf.",
  },
  {
    Icon: FlaskConical,
    title: "Clear, honest information",
    text: "Pack size and composition are listed up front, so a prescriber can check a product at a glance.",
  },
  {
    Icon: BookOpenCheck,
    title: "Gentle on skin",
    text: "Formulations that respect sensitive, reactive and recovering skin.",
  },
  {
    Icon: MessageCircle,
    title: "A real person to talk to",
    text: "Ask about a product, a stockist or availability and a person from our team replies on WhatsApp.",
  },
];

export default function Home() {
  const hero = useRef(null);
  const { products, categories } = useContent();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      gsap.set(".hero-line > span", { yPercent: 115 });
      gsap.set(".hero-fade", { opacity: 0, y: 18 });
      const stop = onReady(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.to(
          ".hero-line > span",
          { yPercent: 0, duration: 1.2, stagger: 0.12 },
          0.1,
        ).to(
          ".hero-fade",
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
          0.7,
        );
      });
      return stop;
    }, hero);
    return () => ctx.revert();
  }, []);

  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <Seo
        title="Neu Natusz Healthcare | Skin Care Medicines, Dombivli, Thane"
        description="Neu Natusz Healthcare Private Limited markets carefully chosen skin care and dermatology products to doctors, pharmacists and families from Dombivli, Thane, Maharashtra."
        path="/"
      />
      {/* ───────── Hero ───────── */}
      <section
        ref={hero}
        className="relative isolate overflow-hidden bg-ink text-paper"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_75%_42%,rgba(5,158,169,0.30),transparent_70%)]" />
        <div className="container-x grid min-h-[92svh] items-center gap-4 pb-28 pt-36 lg:grid-cols-12 lg:gap-10 lg:pb-32 lg:pt-28">
          <div className="order-2 lg:order-1 lg:col-span-7">
            <h1 className="text-[clamp(2.6rem,7.2vw,6.4rem)] leading-[0.98] tracking-tight">
              <span className="line-mask hero-line">
                <span className="block">Skin care,</span>
              </span>
              <span className="line-mask hero-line">
                <span className="block">practised</span>
              </span>
              <span className="line-mask hero-line">
                <span className="block italic text-brand">with care.</span>
              </span>
            </h1>
            <p className="hero-fade mt-6 max-w-md text-base leading-relaxed text-paper/70 sm:mt-7 sm:text-lg">
              {site.legalName} brings carefully chosen skin care and dermatology
              products to doctors, pharmacists and the families who rely on
              them.
            </p>
            <div className="hero-fade mt-8 flex flex-wrap gap-3 sm:mt-9">
              <Link to="/products" className="btn-rose">
                Explore products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="order-1 mx-auto w-full max-w-[220px] sm:max-w-[320px] lg:order-2 lg:col-span-5 lg:max-w-[560px]">
            <BloomMark className="h-auto w-full overflow-visible" />
          </div>
        </div>
      </section>

      {/* ───────── Category strip ───────── */}
      <section className="border-b border-ink/10 bg-mist py-6">
        <Marquee items={categories.map((c) => c.name)} />
      </section>

      {/* ───────── Statement ───────── */}
      <section className="py-12 sm:py-20 lg:py-24">
        <div className="container-x">
          <ScrollWords
            text={statement}
            className="max-w-5xl font-display text-2xl leading-[1.25] sm:text-4xl lg:text-5xl"
          />
          <Link
            to="/about"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-dark transition hover:gap-3 sm:mt-10"
          >
            Read our story <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ───────── Categories (swipe sideways on phones) ───────── */}
      <section className="pb-12 sm:pb-20 lg:pb-24">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="max-w-xl text-3xl leading-tight sm:text-5xl">
              Find what your skin needs
            </h2>
          </div>

          <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
            {categories.map((c, i) => {
              const Icon = icons[c.id] || Leaf;
              const count = products.filter((p) => p.category === c.id).length;
              return (
                <Link
                  key={c.id}
                  to={`/products?category=${c.id}`}
                  className={`group relative flex min-h-[150px] w-[68%] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl border border-ink/10 p-5 transition duration-500 hover:border-ink hover:bg-ink hover:text-paper sm:min-h-[180px] sm:w-auto sm:p-7 ${
                    i === 0 ? "bg-ink text-paper" : "bg-white"
                  }`}
                >
                  <Icon
                    className="h-6 w-6 text-brand transition duration-500 group-hover:scale-110 sm:h-7 sm:w-7"
                    strokeWidth={1.5}
                  />
                  <div>
                    <h3 className="font-display text-xl leading-snug sm:text-2xl">
                      {c.name}
                    </h3>
                    {c.blurb && (
                      <p
                        className={`mt-1.5 max-w-xs text-sm leading-relaxed ${i === 0 ? "text-paper/65" : "text-ink/60 group-hover:text-paper/65"}`}
                      >
                        {c.blurb}
                      </p>
                    )}
                    <p className="mt-4 flex items-center justify-between text-sm font-semibold">
                      <span>
                        {count} {count === 1 ? "product" : "products"}
                      </span>
                      <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-ink/45 sm:hidden">
            Swipe to see more →
          </p>
        </div>
      </section>

      {/* ───────── Featured products (swipe sideways on phones) ───────── */}
      <section className="bg-mist py-12 sm:py-16 lg:py-20">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-3xl leading-tight sm:text-5xl">
              Featured products
            </h2>
            <Link to="/products" className="btn-outline-dark">
              See the full range
            </Link>
          </div>
          <ProductShowcase items={featured} scroll className="mt-8 sm:mt-12" />
          {featured.length > 1 && (
            <p className="mt-2 text-xs text-ink/45 sm:hidden">
              Swipe to see more →
            </p>
          )}
        </div>
      </section>

      {/* ───────── Principles ───────── */}
      <section className="bg-ink py-16 text-paper sm:py-24 lg:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <h2 className="text-3xl leading-tight sm:text-5xl">
              What you can expect from us
            </h2>
          </div>
          <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:col-span-8">
            {principles.map(({ Icon, title, text }) => (
              <div
                key={title}
                className="border-t border-white/15 pt-5 sm:pt-6"
              >
                <Icon className="h-6 w-6 text-brand" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-xl sm:mt-5 sm:text-2xl">
                  {title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-paper/65">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Call to action ───────── */}
      <section className="py-12 sm:py-20">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-deep px-6 py-12 text-center text-paper sm:px-16 sm:py-20">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand/25 blur-3xl" />
            <h2 className="relative mx-auto max-w-2xl text-3xl leading-tight sm:text-5xl">
              Looking for a product, or want to stock with us?
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-paper/70 sm:mt-5">
              Send a message and we will get back to you with availability and
              details.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3 sm:mt-9">
              <a
                href={generalEnquiryLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-rose"
              >
                <WhatsAppIcon className="h-4 w-4" /> Message on WhatsApp
              </a>
              <Link to="/contact" className="btn-outline-light">
                Contact details
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
