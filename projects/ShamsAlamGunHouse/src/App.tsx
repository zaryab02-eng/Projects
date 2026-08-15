import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloatButton } from "@/components/layout/WhatsAppFloatButton";
import Home from "@/pages/Home";
import { RestorationsPage } from "@/pages/RestorationsPage";
import { GalleryPage } from "@/pages/GalleryPage";

/**
 * App shell: router + persistent layout (Navbar, WhatsApp button, Footer)
 * wrapping whichever route is active.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <WhatsAppFloatButton />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restorations" element={<RestorationsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
