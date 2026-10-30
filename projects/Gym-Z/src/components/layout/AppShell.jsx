// Wraps every authenticated page with Navbar + Sidebar (desktop) / BottomNav
// (mobile + tablet) + Footer, so pages only need to render their own content.
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import BottomNav from "./BottomNav.jsx";
import Footer from "./Footer.jsx";
import OfflineBanner from "./OfflineBanner.jsx";

export default function AppShell({ children }) {
  const { pathname } = useLocation();

  // Always land at the top of a new page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-ink-900">
      <OfflineBanner />
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-6">
            {children}
          </main>
          <Footer withNav />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
