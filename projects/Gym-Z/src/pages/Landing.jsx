import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Icon from "../components/ui/Icon.jsx";

const FEATURES = [
  { icon: "bell", text: "One-tap reminders" },
  { icon: "file", text: "PDF reports" },
  { icon: "check", text: "Works offline" },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user, gym, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate(gym ? "/dashboard" : "/create-gym", { replace: true });
    }
  }, [loading, user, gym, navigate]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-ink-900">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col bg-ink-900 relative"
      style={{
        backgroundImage:
          "radial-gradient(60% 45% at 50% 0%, rgba(232,93,18,0.16), transparent 70%)",
      }}
    >
      <header className="flex items-center justify-between px-5 sm:px-8 h-16">
        <span className="font-bold text-[17px] tracking-tight">
          Gym<span className="text-copper-400">-Z</span>
        </span>
        <Link
          to="/rankings"
          className="text-sm font-medium text-copper-400 px-3 h-10 inline-flex items-center"
        >
          Rankings
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-xl animate-fade-up">
          <img
            src="/gymZ.webp"
            alt="Gym-Z"
            className="h-20 w-20 rounded-[22px] object-cover mx-auto mb-8 shadow-sheet"
          />
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.02]">
            Gym<span className="text-copper-400">-Z</span>
          </h1>
          <p className="text-ink-500 text-lg sm:text-xl mt-5 leading-snug">
            Every member, every renewal,
            <br className="hidden sm:block" /> right on time.
          </p>
          <Link
            to="/login"
            className="mt-10 inline-flex items-center justify-center h-12 px-9 rounded-full bg-copper-500 hover:bg-copper-600 text-white text-[15px] font-semibold transition-all active:scale-[0.97]"
          >
            Get Started
          </Link>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {FEATURES.map((f) => (
              <span
                key={f.text}
                className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-300"
              >
                <Icon name={f.icon} size={16} className="text-copper-400" />
                {f.text}
              </span>
            ))}
          </div>
        </div>
      </main>

      <p className="text-center text-xs text-ink-500 py-6">Made by Zaryab</p>
    </div>
  );
}
