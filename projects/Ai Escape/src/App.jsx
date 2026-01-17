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
    <div className="h-screen flex items-center justify-center p-1 md:p-4 cyber-grid overflow-hidden">
      <div className="w-full max-w-2xl md:max-w-4xl">
        {/* Title */}
        <div className="text-center mb-2 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-7xl lg:text-8xl font-bold text-cyber-accent glow-text mb-0.5 md:mb-4 leading-tight">
            ESCAPE ROOM
          </h1>
          <p className="text-xs md:text-2xl text-white text-opacity-70 mb-0 md:mb-2 leading-tight">
            Multiplayer Challenge
          </p>
          <p className="text-xs md:text-base text-white text-opacity-50 leading-none hidden md:block">
            Solve AI puzzles. Beat the clock.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-1.5 md:gap-6">
          {/* Admin Card */}
          <Link to="/admin" className="block">
            <div
              className="card hover:border-cyber-accent transition-all duration-300 cursor-pointer 
                          hover:scale-105 h-full p-2 md:p-6"
            >
              <div className="text-center">
                <div
                  className="w-10 h-10 md:w-20 md:h-20 bg-cyber-accent rounded-full flex items-center justify-center 
                              mx-auto mb-1 md:mb-4"
                >
                  <Shield size={16} className="md:block hidden text-black" />
                  <Shield size={12} className="md:hidden text-black" />
                </div>
                <h2 className="text-xs md:text-3xl font-bold text-cyber-accent mb-0.5 md:mb-3 leading-tight">
                  CREATE GAME
                </h2>
                <p className="text-xs md:text-base text-white text-opacity-70 mb-1 md:mb-4 leading-tight">
                  Start new game
                </p>
                <ul className="text-left text-white text-opacity-60 space-y-0.5 md:space-y-2 text-xs md:text-base hidden md:block">
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
                          hover:scale-105 h-full p-2 md:p-6"
            >
              <div className="text-center">
                <div
                  className="w-10 h-10 md:w-20 md:h-20 bg-cyber-accent rounded-full flex items-center justify-center 
                              mx-auto mb-1 md:mb-4"
                >
                  <Users size={16} className="md:block hidden text-black" />
                  <Users size={12} className="md:hidden text-black" />
                </div>
                <h2 className="text-xs md:text-3xl font-bold text-cyber-accent mb-0.5 md:mb-3 leading-tight">
                  JOIN GAME
                </h2>
                <p className="text-xs md:text-base text-white text-opacity-70 mb-1 md:mb-4 leading-tight">
                  Enter room code
                </p>
                <ul className="text-left text-white text-opacity-60 space-y-0.5 md:space-y-2 text-xs md:text-base hidden md:block">
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
