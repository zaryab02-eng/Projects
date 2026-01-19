import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Play } from "lucide-react";
import { createGameRoom, joinGameRoom, setGameConfig, startGame } from "../services/gameService";
import GameRoom from "../components/GameRoom";
import SoloLogin from "../components/SoloLogin";

/**
 * Solo Game Page - for single player to play alone
 * Requires Google login and display name
 */
export default function SoloGamePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [difficulty, setDifficulty] = useState("Medium");
  const [totalLevels, setTotalLevels] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const handleLoginComplete = (userData) => {
    setUser(userData);
  };

  const handleStartSoloGame = async (e) => {
    e.preventDefault();

    if (!user || !user.displayName) {
      setError("Please complete login first");
      return;
    }

    if (totalLevels !== 5 && totalLevels !== 10) {
      setError("Levels must be either 5 or 10");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create a room
      const code = await createGameRoom(`Solo-${user.displayName}`);
      setRoomCode(code);

      // Use user UID as identifier for solo mode
      const pid = await joinGameRoom(code, `solo-${user.uid}`, user.displayName);

      // Set game configuration - solo mode doesn't use duration (unlimited time)
      // Set a high duration as placeholder (not used in solo mode)
      await setGameConfig(code, difficulty, 999, totalLevels);

      // Store solo-specific data
      sessionStorage.setItem("soloUserId", user.uid);
      sessionStorage.setItem("soloDifficulty", difficulty);
      sessionStorage.setItem("soloTotalLevels", totalLevels.toString());

      // Start game immediately
      await startGame(code);

      setPlayerId(pid);
      setGameStarted(true);

      // Store in sessionStorage
      sessionStorage.setItem("roomCode", code);
      sessionStorage.setItem("playerId", pid);
      sessionStorage.setItem("playerName", user.displayName);
      sessionStorage.setItem("isAdmin", "false");
      sessionStorage.setItem("isSolo", "true");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show login if not logged in
  if (!user) {
    return <SoloLogin onLoginComplete={handleLoginComplete} />;
  }

  if (gameStarted && roomCode && playerId) {
    return (
      <GameRoom
        roomCode={roomCode}
        playerId={playerId}
        playerName={user.displayName}
        isAdmin={false}
      />
    );
  }

  return (
    <div className="viewport-container flex items-center justify-center cyber-grid overflow-y-auto">
      <div className="w-full max-w-2xl px-4 py-3 md:py-4">
        <div className="text-center mb-3 md:mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyber-accent glow-text mb-1 md:mb-2">
            SOLO GAME SETUP
          </h1>
          <p className="text-xs md:text-sm text-white text-opacity-70">
            Choose your challenge
          </p>
        </div>

        <div className="card fade-in p-4 md:p-5">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Settings className="text-cyber-accent" size={20} />
            <h2 className="text-lg md:text-xl font-bold text-white">GAME SETUP</h2>
          </div>

          <form onSubmit={handleStartSoloGame} className="space-y-2.5 md:space-y-3">
            <div>
              <label className="block text-white font-bold mb-1 text-xs md:text-sm">
                DIFFICULTY
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input text-sm md:text-base"
                disabled={loading}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-bold mb-1 text-xs md:text-sm">
                NUMBER OF LEVELS
              </label>
              <p className="text-white text-opacity-60 text-xs mb-2">
                Choose either 5 or 10 levels
              </p>
              <select
                value={totalLevels}
                onChange={(e) => setTotalLevels(parseInt(e.target.value))}
                className="input text-sm md:text-base"
                disabled={loading}
              >
                <option value={5}>5 Levels</option>
                <option value={10}>10 Levels</option>
              </select>
            </div>

            {error && (
              <div className="bg-cyber-danger bg-opacity-20 p-2 md:p-3 rounded-lg border border-cyber-danger">
                <p className="text-cyber-danger text-xs md:text-sm">{error}</p>
              </div>
            )}

            {error && (
              <div className="bg-cyber-danger bg-opacity-20 p-2 md:p-3 rounded-lg border border-cyber-danger">
                <p className="text-cyber-danger text-xs md:text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 text-sm md:text-base py-2.5"
            >
              <Play size={16} />
              {loading ? "STARTING..." : "START SOLO GAME"}
            </button>
          </form>

          <div className="mt-3 pt-3 border-t border-cyber-border">
            <button
              onClick={() => navigate("/")}
              className="btn-secondary w-full text-xs md:text-sm py-2"
              disabled={loading}
            >
              ← BACK TO HOME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
