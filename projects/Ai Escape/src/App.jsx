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
      <div className="w-full max-w-2xl md:max-w-5xl px-4 py-4 md:py-8">
        {/* Title */}
        <div className="text-center mb-6 md:mb-8 relative">
          {/* Leaderboard Button - Top Right */}
          <Link
            to="/leaderboard"
            className="absolute top-0 right-0 flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 bg-cyber-surface border border-cyber-accent/30 rounded-xl hover:bg-cyber-accent hover:bg-opacity-20 hover:border-cyber-accent transition-all duration-300 text-xs md:text-sm shadow-lg hover:shadow-xl"
          >
            <Trophy size={14} className="md:hidden" />
            <Trophy size={18} className="hidden md:block" />
            <span className="hidden sm:inline">LEADERBOARD</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-cyber-accent glow-text mb-2 md:mb-3 leading-tight tracking-tight">
            ESCAPE ROOM
          </h1>
          <p className="text-sm md:text-xl text-white text-opacity-80 mb-1 md:mb-2 leading-tight font-medium">
            Multiplayer Challenge
          </p>
          <p className="text-xs md:text-base text-white text-opacity-60 leading-relaxed hidden md:block">
            Solve AI puzzles. Beat the clock.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Solo Game Card */}
          <Link to="/solo" className="block group">
            <div
              className="card hover:border-cyber-accent/50 transition-all duration-300 cursor-pointer 
                          hover:scale-[1.02] active:scale-[0.98] h-full p-4 md:p-6 hover:shadow-2xl"
            >
              <div className="text-center">
                <div
                  className="w-12 h-12 md:w-20 md:h-20 bg-cyber-accent rounded-2xl flex items-center justify-center 
                              mx-auto mb-3 md:mb-4 shadow-lg shadow-cyber-accent/20 group-hover:shadow-cyber-accent/40 transition-shadow"
                >
                  <User size={20} className="md:hidden text-black" />
                  <User size={40} className="hidden md:block text-black" />
                </div>
                <h2 className="text-lg md:text-3xl font-bold text-cyber-accent mb-2 md:mb-3 leading-tight tracking-tight">
                  SOLO GAME
                </h2>
                <p className="text-sm md:text-base text-white text-opacity-80 mb-2 md:mb-3 leading-relaxed font-medium">
                  Play alone at your pace
                </p>
                <ul className="text-left text-white text-opacity-70 space-y-1 md:space-y-1.5 text-xs md:text-sm hidden md:block">
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
              className="card hover:border-cyber-accent/50 transition-all duration-300 cursor-pointer 
                          hover:scale-[1.02] active:scale-[0.98] h-full p-4 md:p-6 hover:shadow-2xl"
            >
              <div className="text-center">
                <div
                  className="w-12 h-12 md:w-20 md:h-20 bg-cyber-accent rounded-2xl flex items-center justify-center 
                              mx-auto mb-3 md:mb-4 shadow-lg shadow-cyber-accent/20 group-hover:shadow-cyber-accent/40 transition-shadow"
                >
                  <Users size={20} className="md:hidden text-black" />
                  <Users size={40} className="hidden md:block text-black" />
                </div>
                <h2 className="text-lg md:text-3xl font-bold text-cyber-accent mb-2 md:mb-3 leading-tight tracking-tight">
                  JOIN GAME
                </h2>
                <p className="text-sm md:text-base text-white text-opacity-80 mb-2 md:mb-3 leading-relaxed font-medium">
                  Enter room code
                </p>
                <ul className="text-left text-white text-opacity-70 space-y-1 md:space-y-1.5 text-xs md:text-sm hidden md:block">
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
        <div className="mt-5 md:mt-6 text-center">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 text-white text-opacity-70 hover:text-opacity-100 
                       text-xs md:text-sm transition-all duration-300 rounded-lg hover:bg-cyber-surface/50 border border-transparent hover:border-cyber-border"
          >
            <Shield size={14} />
            Create Multiplayer Game
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 md:mt-8 text-center text-white text-opacity-50 text-[10px] md:text-xs space-y-1">
          <p className="hidden md:block">PWA Enabled • Install on your device for best experience</p>
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
