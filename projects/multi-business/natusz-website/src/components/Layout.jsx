import { useEffect, useLayoutEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Preloader from "./Preloader";
import WhatsAppFloat from "./WhatsAppFloat";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";

export default function Layout() {
  const { pathname } = useLocation();
  const main = useRef(null);
  const isGallery = pathname === "/gallery";

  // Start every page at the top
  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => clearTimeout(t);
  }, [pathname]);

  // Soft fade-in on page change (opacity only, so fixed elements keep working)
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !main.current) return;
    gsap.fromTo(main.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out", clearProps: "opacity" });
  }, [pathname]);

  return (
    <>
      <Preloader />
      <Navbar />
      <main ref={main} className="min-h-screen">
        <Outlet />
      </main>
      {!isGallery && <Footer />}
      <WhatsAppFloat />
    </>
  );
}
