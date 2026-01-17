import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Shield, Users, User } from "lucide-react";
import AdminPage from "./pages/AdminPage";
import JoinPage from "./pages/JoinPage";
import GamePage from "./pages/GamePage";
import SoloGamePage from "./pages/SoloGamePage";

/**
 * Main App Component - Landing page and routing
 */
function HomePage() {
  return (
    <div className="viewport-container flex items-center justify-center cyber-grid">
      <div className="w-full max-w-2xl md:max-w-4xl px-4 py-6 md:py-8">
        {/* Title */}
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-bold text-cyber-accent glow-text mb-2 md:mb-4 leading-tight">
            ESCAPE ROOM
          </h1>
          <p className="text-sm md:text-2xl text-white text-opacity-70 mb-1 md:mb-2 leading-tight">
            Multiplayer Challenge
          </p>
          <p className="text-xs md:text-base text-white text-opacity-50 leading-none hidden md:block">
            Solve AI puzzles. Beat the clock.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-3 md:gap-6">
          {/* Solo Game Card */}
          <Link to="/solo" className="block">
            <div
              className="card hover:border-cyber-accent transition-all duration-300 cursor-pointer 
                          hover:scale-[1.02] active:scale-[0.98] h-full p-4 md:p-6"
            >
              <div className="text-center">
                <div
                  className="w-12 h-12 md:w-20 md:h-20 bg-cyber-accent rounded-full flex items-center justify-center 
                              mx-auto mb-3 md:mb-4"
                >
                  <User size={20} className="md:hidden text-black" />
                  <User size={40} className="hidden md:block text-black" />
                </div>
                <h2 className="text-lg md:text-3xl font-bold text-cyber-accent mb-2 md:mb-3 leading-tight">
                  SOLO GAME
                </h2>
                <p className="text-sm md:text-base text-white text-opacity-70 mb-2 md:mb-4 leading-tight">
                  Play alone at your pace
                </p>
                <ul className="text-left text-white text-opacity-60 space-y-1 md:space-y-2 text-xs md:text-base hidden md:block">
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
                          hover:scale-[1.02] active:scale-[0.98] h-full p-4 md:p-6"
            >
              <div className="text-center">
                <div
                  className="w-12 h-12 md:w-20 md:h-20 bg-cyber-accent rounded-full flex items-center justify-center 
                              mx-auto mb-3 md:mb-4"
                >
                  <Users size={20} className="md:hidden text-black" />
                  <Users size={40} className="hidden md:block text-black" />
                </div>
                <h2 className="text-lg md:text-3xl font-bold text-cyber-accent mb-2 md:mb-3 leading-tight">
                  JOIN GAME
                </h2>
                <p className="text-sm md:text-base text-white text-opacity-70 mb-2 md:mb-4 leading-tight">
                  Enter room code
                </p>
                <ul className="text-left text-white text-opacity-60 space-y-1 md:space-y-2 text-xs md:text-base hidden md:block">
                  <li>• Real-time competition</li>
                  <li>• Climb the leaderboard</li>
                </ul>
              </div>
            </div>
          </Link>
        </div>

        {/* Create Game Link - Small button below cards */}
        <div className="mt-4 md:mt-6 text-center">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-white text-opacity-60 hover:text-opacity-100 
                       text-xs md:text-sm transition-all duration-300 underline underline-offset-2"
          >
            <Shield size={14} />
            Create Multiplayer Game
          </Link>
        </div>

        {/* Footer */}
        <div className="hidden md:block mt-6 md:mt-8 text-center text-white text-opacity-50 text-sm">
          <p>PWA Enabled • Install on your device for best experience</p>
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
      </Routes>
    </BrowserRouter>
  );
}
