import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import { joinGameRoom } from "../services/gameService";

/**
 * Join Page - for players to join an existing game room
 */
export default function JoinPage() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerIdentifier, setPlayerIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();

    if (!roomCode.trim() || !playerName.trim() || !playerIdentifier.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const playerId = await joinGameRoom(
        roomCode.toUpperCase().trim(),
        playerIdentifier.trim(),
        playerName.trim(),
      );

      // Store player data in sessionStorage for reconnection
      sessionStorage.setItem("roomCode", roomCode.toUpperCase().trim());
      sessionStorage.setItem("playerId", playerId);
      sessionStorage.setItem("playerName", playerName.trim());
      sessionStorage.setItem("isAdmin", "false");

      navigate("/game");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="viewport-container flex items-center justify-center cyber-grid">
      <div className="w-full max-w-md px-4 py-6 overflow-y-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-cyber-accent glow-text mb-3 md:mb-4">
            ESCAPE ROOM
          </h1>
          <p className="text-base md:text-xl text-white text-opacity-70">
            Join an existing game
          </p>
        </div>

        <div className="card fade-in">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <UserPlus className="text-cyber-accent" size={24} />
            <h2 className="text-xl md:text-3xl font-bold text-white">JOIN GAME</h2>
          </div>

          <form onSubmit={handleJoin} className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-white font-bold mb-2 text-sm md:text-base">
                ROOM CODE
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                className="input uppercase text-lg"
                maxLength={6}
                disabled={loading}
                autoFocus
              />
            </div>

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
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-2 text-sm md:text-base">
                UNIQUE IDENTIFIER
              </label>
              <input
                type="text"
                value={playerIdentifier}
                onChange={(e) => setPlayerIdentifier(e.target.value)}
                placeholder="Roll number / Phone / Email"
                className="input text-lg"
                disabled={loading}
              />
              <p className="text-white text-opacity-50 text-xs md:text-sm mt-1">
                This ensures you can only join from one device
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
              <LogIn size={18} />
              {loading ? "JOINING..." : "JOIN GAME"}
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
