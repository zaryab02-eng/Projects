import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Shield, Users, User, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { subscribeToOnlinePlayers } from "./services/onlineService";
import AdminPage from "./pages/AdminPage";
import JoinPage from "./pages/JoinPage";
import GamePage from "./pages/GamePage";
import SoloGamePage from "./pages/SoloGamePage";
import GlobalLeaderboardPage from "./pages/GlobalLeaderboardPage";
import DiagnosticPage from "./components/DiagnosticPage";

/**
 * Main App Component - Landing page and routing
 */
function HomePage() {
  const [onlinePlayers, setOnlinePlayers] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToOnlinePlayers((count) => {
      setOnlinePlayers(count || 0);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  return (
    <div className="viewport-container flex items-center justify-center cyber-grid overflow-y-auto">
      <div className="w-full max-w-3xl px-4 py-4 md:py-6">
        {/* Title */}
        <div className="text-center mb-5 md:mb-6 relative">
          {/* Leaderboard Button - Top Right */}
          <Link
            to="/leaderboard"
            className="absolute top-0 right-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-600 bg-slate-900/80 hover:bg-slate-800 hover:border-emerald-400 text-[11px] md:text-xs font-medium text-slate-100 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Trophy size={14} className="md:hidden" />
            <Trophy size={18} className="hidden md:block" />
            <span className="hidden sm:inline">LEADERBOARD</span>
          </Link>

          {/* Online Players Badge - Top Left */}
          <div className="absolute top-0 left-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/70 bg-emerald-900/40 text-[11px] md:text-xs font-medium text-emerald-200 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{onlinePlayers}</span>
            <span className="hidden sm:inline">Players Online</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-cyber-accent glow-text mb-1.5 md:mb-2 leading-tight tracking-tight">
            ESCAPE ROOM
          </h1>
          <p className="text-[13px] md:text-sm text-slate-200 mb-1 leading-tight font-medium">
            AI Puzzle Challenge
          </p>
          <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed hidden md:block">
            Solve generated puzzles, clear mini-games, and race your friends.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-3 md:gap-4">
          {/* Solo Game Card */}
          <Link to="/solo" className="block group">
            <div
              className="card hover:border-emerald-400/40 transition-all duration-200 cursor-pointer 
                          hover:translate-y-0.5 h-full"
            >
              <div className="text-center">
                <div
                  className="w-10 h-10 md:w-12 md:h-12 bg-cyber-accent/90 rounded-full flex items-center justify-center 
                              mx-auto mb-2.5 md:mb-3 shadow-md shadow-cyber-accent/30 group-hover:shadow-cyber-accent/40 transition-shadow"
                >
                  <User size={20} className="md:hidden text-black" />
                  <User size={40} className="hidden md:block text-black" />
                </div>
                <h2 className="text-base md:text-xl font-semibold text-slate-100 mb-1.5 leading-tight tracking-tight">
                  SOLO GAME
                </h2>
                <p className="text-xs md:text-sm text-slate-300 mb-1.5 leading-relaxed font-normal">
                  Play alone at your pace
                </p>
                <ul className="text-left text-slate-400 space-y-1 text-[11px] md:text-xs hidden md:block">
                  <li className="flex items-center gap-2">
                    <span className="text-cyber-accent">•</span>
                    <span>Set your own difficulty</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyber-accent">•</span>
                    <span>Choose levels & time</span>
                  </li>
                </ul>
              </div>
            </div>
          </Link>

          {/* Join Card */}
          <Link to="/join" className="block group">
            <div
              className="card hover:border-emerald-400/40 transition-all duration-200 cursor-pointer 
                          hover:translate-y-0.5 h-full"
            >
              <div className="text-center">
                <div
                  className="w-10 h-10 md:w-12 md:h-12 bg-cyber-accent/90 rounded-full flex items-center justify-center 
                              mx-auto mb-2.5 md:mb-3 shadow-md shadow-cyber-accent/30 group-hover:shadow-cyber-accent/40 transition-shadow"
                >
                  <Users size={20} className="md:hidden text-black" />
                  <Users size={40} className="hidden md:block text-black" />
                </div>
                <h2 className="text-base md:text-xl font-semibold text-slate-100 mb-1.5 leading-tight tracking-tight">
                  JOIN GAME
                </h2>
                <p className="text-xs md:text-sm text-slate-300 mb-1.5 leading-relaxed font-normal">
                  Enter room code
                </p>
                <ul className="text-left text-slate-400 space-y-1 text-[11px] md:text-xs hidden md:block">
                  <li className="flex items-center gap-2">
                    <span className="text-cyber-accent">•</span>
                    <span>Real-time competition</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyber-accent">•</span>
                    <span>Climb the leaderboard</span>
                  </li>
                </ul>
              </div>
            </div>
          </Link>
        </div>

        {/* Create Game Link - Small button below cards */}
        <div className="mt-4 md:mt-5 text-center">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-300 hover:text-slate-100 
                       text-[11px] md:text-xs transition-all duration-200 rounded-full hover:bg-slate-900/70 border border-slate-600 hover:border-emerald-400"
          >
            <Shield size={14} />
            Create Multiplayer Game
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-5 md:mt-6 text-center text-slate-500 text-[10px] md:text-[11px] space-y-0.5">
          <p className="hidden md:block">Install as app for the smoothest experience.</p>
          <p>Made by Zaryab</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/solo" element={<SoloGamePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/leaderboard" element={<GlobalLeaderboardPage />} />
        <Route path="/diagnostic" element={<DiagnosticPage />} />
      </Routes>
    </BrowserRouter>
  );
}
