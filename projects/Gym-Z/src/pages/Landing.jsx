import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Spinner from "../components/ui/Spinner.jsx";

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
      <div className="h-[100dvh] flex items-center justify-center bg-ink-900">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-ink-900">
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-display italic text-5xl sm:text-7xl tracking-wide mb-3 text-copper-400">
            Gym-Z
          </h1>
          <p className="text-ink-500 text-sm sm:text-base font-body mb-10">
            Every member, every renewal, right on time.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-copper-500 hover:bg-copper-600 text-white text-sm font-semibold transition-colors"
            >
              Enter App
            </Link>
            <Link
              to="/rankings"
              className="text-sm font-semibold text-steel-300 hover:text-steel-200"
            >
              View Gym Rankings
            </Link>
          </div>
        </div>
      </main>
      <p className="text-center text-[11px] text-ink-600 font-mono pb-4">
        Made by Zaryab
      </p>
    </div>
  );
}
