import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Play } from "lucide-react";
import { createGameRoom, joinGameRoom, setGameConfig, startGame } from "../services/gameService";
import GameRoom from "../components/GameRoom";

/**
 * Solo Game Page - for single player to play alone
 */
export default function SoloGamePage() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [duration, setDuration] = useState(30);
  const [totalLevels, setTotalLevels] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartSoloGame = async (e) => {
    e.preventDefault();

    if (!playerName.trim()) {
      setError("Player name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create a room
      const code = await createGameRoom(`Solo-${playerName.trim()}`);
      setRoomCode(code);

      // Add player to room first (room is in "waiting" status)
      const pid = await joinGameRoom(code, `solo-${Date.now()}`, playerName.trim());

      // Set game configuration
      await setGameConfig(code, difficulty, duration, totalLevels);

      // Start game immediately
      await startGame(code);

      setPlayerId(pid);
      setGameStarted(true);

      // Store in sessionStorage
      sessionStorage.setItem("roomCode", code);
      sessionStorage.setItem("playerId", pid);
      sessionStorage.setItem("playerName", playerName.trim());
      sessionStorage.setItem("isAdmin", "false");
      sessionStorage.setItem("isSolo", "true");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (gameStarted && roomCode && playerId) {
    return (
      <GameRoom
        roomCode={roomCode}
        playerId={playerId}
        playerName={playerName}
        isAdmin={false}
      />
    );
  }

  return (
    <div className="viewport-container flex items-center justify-center cyber-grid">
      <div className="w-full max-w-md px-4 py-6 overflow-y-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-cyber-accent glow-text mb-3 md:mb-4">
            SOLO GAME
          </h1>
          <p className="text-base md:text-xl text-white text-opacity-70">
            Play alone at your own pace
          </p>
        </div>

        <div className="card fade-in">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <Settings className="text-cyber-accent" size={24} />
            <h2 className="text-xl md:text-3xl font-bold text-white">GAME SETUP</h2>
          </div>

          <form onSubmit={handleStartSoloGame} className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-white font-bold mb-2 text-sm md:text-base">
                YOUR NAME
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="input text-lg"
                disabled={loading}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-2 text-sm md:text-base">
                DIFFICULTY LEVEL
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input text-lg"
                disabled={loading}
              >
                <option value="Easy">Easy - Simple riddles</option>
                <option value="Medium">Medium - Logic puzzles</option>
                <option value="Hard">Hard - Complex challenges</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-bold mb-2 text-sm md:text-base">
                GAME DURATION (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="input text-lg"
                disabled={loading}
              />
              <p className="text-white text-opacity-50 text-xs md:text-sm mt-1">
                Recommended: 15-45 minutes
              </p>
            </div>

            <div>
              <label className="block text-white font-bold mb-2 text-sm md:text-base">
                TOTAL LEVELS
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={totalLevels}
                onChange={(e) => setTotalLevels(parseInt(e.target.value))}
                className="input text-lg"
                disabled={loading}
              />
              <p className="text-white text-opacity-50 text-xs md:text-sm mt-1">
                Number of questions/levels in the game
              </p>
            </div>

            {error && (
              <div className="bg-cyber-danger bg-opacity-20 p-3 md:p-4 rounded-lg border border-cyber-danger">
                <p className="text-cyber-danger text-sm md:text-base">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 text-base md:text-lg"
            >
              <Play size={18} />
              {loading ? "STARTING..." : "START SOLO GAME"}
            </button>
          </form>

          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-cyber-border">
            <button
              onClick={() => navigate("/")}
              className="btn-secondary w-full text-sm md:text-base"
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
