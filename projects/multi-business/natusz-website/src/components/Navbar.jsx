import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { site } from "../config/site";

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
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The bar is see-through only at the very top of the Home page (dark hero).
  // On every other page, and once you scroll, it is solid so the menu is always easy to read.
  const isHome = pathname === "/";
  const solid = scrolled || !isHome;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid
            ? "border-b border-ink/10 bg-paper/95 text-ink shadow-sm backdrop-blur-md"
            : "text-paper"
        }`}
      >
        <div className="container-x flex h-[60px] items-center justify-between lg:h-[72px]">
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
        </div>

        {/* Phone & tablet: all pages shown in one row, equal width, no scrolling */}
        <nav
          className="container-x grid grid-cols-5 lg:hidden"
          aria-label="Mobile"
        >
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `border-b-2 pb-2.5 pt-1.5 text-center text-[13px] tracking-wide transition ${
                  isActive
                    ? "border-brand font-semibold"
                    : `border-transparent font-medium ${solid ? "text-ink/60" : "text-paper/70"}`
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>
    </>
  );
}
