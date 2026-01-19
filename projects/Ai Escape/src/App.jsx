import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Shield, Users, User, Trophy } from "lucide-react";
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
  return (
    <div className="viewport-container flex items-center justify-center cyber-grid overflow-y-auto">
      <div className="w-full max-w-2xl md:max-w-4xl px-4 py-4 md:py-6">
        {/* Title */}
        <div className="text-center mb-4 md:mb-6 relative">
          {/* Leaderboard Button - Top Right */}
          <Link
            to="/leaderboard"
            className="absolute top-0 right-0 flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 bg-cyber-surface border border-cyber-accent rounded-lg hover:bg-cyber-accent hover:bg-opacity-20 transition-all duration-300 text-xs md:text-sm"
          >
            <Trophy size={14} className="md:hidden" />
            <Trophy size={18} className="hidden md:block" />
            <span className="hidden sm:inline">LEADERBOARD</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-cyber-accent glow-text mb-1 md:mb-2 leading-tight">
            ESCAPE ROOM
          </h1>
          <p className="text-xs md:text-lg text-white text-opacity-70 mb-0.5 md:mb-1 leading-tight">
            Multiplayer Challenge
          </p>
          <p className="text-xs md:text-sm text-white text-opacity-50 leading-none hidden md:block">
            Solve AI puzzles. Beat the clock.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-2.5 md:gap-4">
          {/* Solo Game Card */}
          <Link to="/solo" className="block">
            <div
              className="card hover:border-cyber-accent transition-all duration-300 cursor-pointer 
                          hover:scale-[1.02] active:scale-[0.98] h-full p-3 md:p-4"
            >
              <div className="text-center">
                <div
                  className="w-10 h-10 md:w-16 md:h-16 bg-cyber-accent rounded-full flex items-center justify-center 
                              mx-auto mb-2 md:mb-3"
                >
                  <User size={18} className="md:hidden text-black" />
                  <User size={32} className="hidden md:block text-black" />
                </div>
                <h2 className="text-base md:text-2xl font-bold text-cyber-accent mb-1 md:mb-2 leading-tight">
                  SOLO GAME
                </h2>
                <p className="text-xs md:text-sm text-white text-opacity-70 mb-1.5 md:mb-2 leading-tight">
                  Play alone at your pace
                </p>
                <ul className="text-left text-white text-opacity-60 space-y-0.5 md:space-y-1 text-xs md:text-sm hidden md:block">
                  <li>• Set your own difficulty</li>
                  <li>• Choose levels & time</li>
                </ul>
              </div>
            </div>
          </Link>

          {/* Join Card */}
          <Link to="/join" className="block">
            <div
              className="card hover:border-cyber-accent transition-all duration-300 cursor-pointer 
                          hover:scale-[1.02] active:scale-[0.98] h-full p-3 md:p-4"
            >
              <div className="text-center">
                <div
                  className="w-10 h-10 md:w-16 md:h-16 bg-cyber-accent rounded-full flex items-center justify-center 
                              mx-auto mb-2 md:mb-3"
                >
                  <Users size={18} className="md:hidden text-black" />
                  <Users size={32} className="hidden md:block text-black" />
                </div>
                <h2 className="text-base md:text-2xl font-bold text-cyber-accent mb-1 md:mb-2 leading-tight">
                  JOIN GAME
                </h2>
                <p className="text-xs md:text-sm text-white text-opacity-70 mb-1.5 md:mb-2 leading-tight">
                  Enter room code
                </p>
                <ul className="text-left text-white text-opacity-60 space-y-0.5 md:space-y-1 text-xs md:text-sm hidden md:block">
                  <li>• Real-time competition</li>
                  <li>• Climb the leaderboard</li>
                </ul>
              </div>
            </div>
          </Link>
        </div>

        {/* Create Game Link - Small button below cards */}
        <div className="mt-3 md:mt-4 text-center">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-white text-opacity-60 hover:text-opacity-100 
                       text-xs md:text-sm transition-all duration-300 underline underline-offset-2"
          >
            <Shield size={12} />
            Create Multiplayer Game
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-4 md:mt-5 text-center text-white text-opacity-50 text-[10px] md:text-xs">
          <p className="hidden md:block">PWA Enabled • Install on your device for best experience</p>
          <p className="mt-1">Made by Zaryab</p>
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
