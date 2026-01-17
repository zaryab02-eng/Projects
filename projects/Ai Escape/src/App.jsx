import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Shield, Users } from "lucide-react";
import AdminPage from "./pages/AdminPage";
import JoinPage from "./pages/JoinPage";
import GamePage from "./pages/GamePage";

/**
 * Main App Component - Landing page and routing
 */
function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-2 md:p-4 cyber-grid">
      <div className="w-full max-w-2xl md:max-w-4xl">
        {/* Title */}
        <div className="text-center mb-3 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-bold text-cyber-accent glow-text mb-1 md:mb-4">
            ESCAPE ROOM
          </h1>
          <p className="text-xs sm:text-sm md:text-2xl text-white text-opacity-70 mb-0.5 md:mb-2">
            Multiplayer Real-Time Challenge
          </p>
          <p className="text-xs sm:text-xs md:text-base text-white text-opacity-50 leading-tight">
            Solve AI puzzles. Beat the clock.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-2 md:gap-6">
          {/* Admin Card */}
          <Link to="/admin" className="block">
            <div
              className="card hover:border-cyber-accent transition-all duration-300 cursor-pointer 
                          hover:scale-105 h-full p-3 md:p-6"
            >
              <div className="text-center">
                <div
                  className="w-12 h-12 md:w-20 md:h-20 bg-cyber-accent rounded-full flex items-center justify-center 
                              mx-auto mb-2 md:mb-4"
                >
                  <Shield size={20} className="md:block hidden text-black" />
                  <Shield size={14} className="md:hidden text-black" />
                </div>
                <h2 className="text-sm md:text-3xl font-bold text-cyber-accent mb-1 md:mb-3">
                  CREATE GAME
                </h2>
                <p className="text-xs md:text-base text-white text-opacity-70 mb-2 md:mb-4">
                  Start a new game room
                </p>
                <ul className="text-left text-white text-opacity-60 space-y-0.5 md:space-y-2 text-xs md:text-base hidden sm:block">
                  <li>• Configure difficulty</li>
                  <li>• Monitor players</li>
                </ul>
              </div>
            </div>
          </Link>

          {/* Join Card */}
          <Link to="/join" className="block">
            <div
              className="card hover:border-cyber-accent transition-all duration-300 cursor-pointer 
                          hover:scale-105 h-full p-3 md:p-6"
            >
              <div className="text-center">
                <div
                  className="w-12 h-12 md:w-20 md:h-20 bg-cyber-accent rounded-full flex items-center justify-center 
                              mx-auto mb-2 md:mb-4"
                >
                  <Users size={20} className="md:block hidden text-black" />
                  <Users size={14} className="md:hidden text-black" />
                </div>
                <h2 className="text-sm md:text-3xl font-bold text-cyber-accent mb-1 md:mb-3">
                  JOIN GAME
                </h2>
                <p className="text-xs md:text-base text-white text-opacity-70 mb-2 md:mb-4">
                  Enter a room code to play
                </p>
                <ul className="text-left text-white text-opacity-60 space-y-0.5 md:space-y-2 text-xs md:text-base hidden sm:block">
                  <li>• Real-time competition</li>
                  <li>• Climb the leaderboard</li>
                </ul>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="hidden md:block mt-8 text-center text-white text-opacity-50 text-sm">
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
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}
