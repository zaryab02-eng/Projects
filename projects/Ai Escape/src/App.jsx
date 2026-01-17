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
    <div className="min-h-screen flex items-center justify-center p-4 cyber-grid">
      <div className="w-full max-w-4xl">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-7xl md:text-8xl font-bold text-cyber-accent glow-text mb-4">
            ESCAPE ROOM
          </h1>
          <p className="text-2xl text-white text-opacity-70 mb-2">
            Multiplayer Real-Time Challenge
          </p>
          <p className="text-white text-opacity-50">
            Compete with up to 5 players. Solve AI-generated puzzles. Beat the
            clock.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Admin Card */}
          <Link to="/admin" className="block">
            <div
              className="card hover:border-cyber-accent transition-all duration-300 cursor-pointer 
                          hover:scale-105 h-full"
            >
              <div className="text-center">
                <div
                  className="w-20 h-20 bg-cyber-accent rounded-full flex items-center justify-center 
                              mx-auto mb-4"
                >
                  <Shield size={40} className="text-black" />
                </div>
                <h2 className="text-3xl font-bold text-cyber-accent mb-3">
                  CREATE GAME
                </h2>
                <p className="text-white text-opacity-70 mb-4">
                  Start a new game room as admin
                </p>
                <ul className="text-left text-white text-opacity-60 space-y-2">
                  <li>• Configure difficulty & duration</li>
                  <li>• Control game flow</li>
                  <li>• Monitor all players</li>
                  <li>• Export results</li>
                </ul>
              </div>
            </div>
          </Link>

          {/* Join Card */}
          <Link to="/join" className="block">
            <div
              className="card hover:border-cyber-accent transition-all duration-300 cursor-pointer 
                          hover:scale-105 h-full"
            >
              <div className="text-center">
                <div
                  className="w-20 h-20 bg-cyber-accent rounded-full flex items-center justify-center 
                              mx-auto mb-4"
                >
                  <Users size={40} className="text-black" />
                </div>
                <h2 className="text-3xl font-bold text-cyber-accent mb-3">
                  JOIN GAME
                </h2>
                <p className="text-white text-opacity-70 mb-4">
                  Enter a room code to play
                </p>
                <ul className="text-left text-white text-opacity-60 space-y-2">
                  <li>• Solve AI puzzles</li>
                  <li>• Real-time competition</li>
                  <li>• Climb the leaderboard</li>
                  <li>• Beat the timer</li>
                </ul>
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-12 card">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">
            KEY FEATURES
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-4xl mb-2">🤖</div>
              <p className="text-cyber-accent font-bold">AI-Powered</p>
              <p className="text-white text-opacity-60 text-sm">
                Dynamic questions via Gemini
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">⚡</div>
              <p className="text-cyber-accent font-bold">Real-Time</p>
              <p className="text-white text-opacity-60 text-sm">
                Live sync & leaderboard
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">🎬</div>
              <p className="text-cyber-accent font-bold">Cinematic</p>
              <p className="text-white text-opacity-60 text-sm">
                Epic level completions
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-white text-opacity-50 text-sm">
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
