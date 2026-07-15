// Public page — accessible without login (see AppRouter.jsx, not wrapped
// in ProtectedRoute). Reads directly from the `gyms` collection root,
// which security rules allow anyone to list/read (see firestore.rules).
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import GymRankCard from "../components/rankings/GymRankCard.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { listRankedGyms } from "../firebase/firestore.js";

export default function GymRankings() {
  const [gyms, setGyms] = useState(null);

  useEffect(() => {
    listRankedGyms().then(setGyms);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-ink-900">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-copper-400">
            Leaderboard
          </span>
          <h1 className="font-display text-3xl sm:text-4xl mt-2">Gym Rankings</h1>
          <p className="text-ink-500 text-sm mt-2">
            Ranked by active member count, updated live.
          </p>
        </div>

        {!gyms ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : gyms.length === 0 ? (
          <p className="text-center text-ink-500 py-16 text-sm">
            No gyms to show yet.
          </p>
        ) : (
          <div className="space-y-3">
            {gyms.map((g, i) => (
              <GymRankCard key={g.id} gym={g} rank={i + 1} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
