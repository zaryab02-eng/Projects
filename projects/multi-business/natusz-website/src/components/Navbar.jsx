import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { site } from "../config/site";
import { generalEnquiryLink } from "../lib/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";

// To add, remove or rename menu items, edit this list.
export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // The bar is see-through only at the very top of the Home page (dark hero).
  // On every other page, and once you scroll, it is solid so the menu is always easy to read.
  const isHome = pathname === "/";
  const solid = !open && (scrolled || !isHome);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid
            ? "border-b border-ink/10 bg-paper/95 text-ink shadow-sm backdrop-blur-md"
            : "text-paper"
        }`}
      >
        <div className="container-x flex h-[72px] items-center justify-between">
          <Link to="/" aria-label={`${site.name} home`} className="block">
            <Logo
              layout="horizontal"
              tone={solid ? "dark" : "light"}
              className="h-9 w-auto sm:h-10"
            />
          </Link>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Main">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `relative py-2 text-sm font-medium transition-opacity after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-current after:transition-transform after:duration-300 ${
                    isActive
                      ? "after:scale-x-100"
                      : "opacity-80 after:scale-x-0 hover:opacity-100 hover:after:scale-x-100"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={generalEnquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-300 sm:inline-flex ${
                solid
                  ? "bg-ink text-paper hover:bg-deep"
                  : "bg-paper text-ink hover:bg-white"
              }`}
            >
              <WhatsAppIcon className="h-4 w-4" />
              Enquire
            </a>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-ink px-6 pb-10 pt-28 text-paper transition duration-500 lg:hidden ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav className="flex flex-col gap-1" aria-label="Mobile">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              tabIndex={open ? 0 : -1}
              className={({ isActive }) =>
                `border-b border-white/10 py-4 font-display text-4xl ${isActive ? "text-brand" : "text-paper"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-2 text-sm text-paper/70">
          <a
            href={`tel:${site.phoneTel}`}
            className="block text-lg text-paper"
            tabIndex={open ? 0 : -1}
          >
            {site.phoneDisplay}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="block break-all"
            tabIndex={open ? 0 : -1}
          >
            {site.email}
          </a>
          <p>{site.address.short}</p>
        </div>
      </div>
    </>
  );
}
