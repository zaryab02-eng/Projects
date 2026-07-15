import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Button from "../components/ui/Button.jsx";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-900">
      <Navbar />
      <main className="flex-1 flex items-center">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-copper-400 mb-4">
            Built for gym owners
          </span>
          <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] mb-5">
            Run your gym like a<br />
            <span className="text-copper-400">well-loaded barbell.</span>
          </h1>
          <p className="text-ink-500 text-base sm:text-lg max-w-xl mx-auto mb-9">
            Gym-Z tracks every member, every renewal and every expiry so nothing
            slips — no spreadsheets, no missed follow-ups, just a clear picture
            of who needs you today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Open App
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
