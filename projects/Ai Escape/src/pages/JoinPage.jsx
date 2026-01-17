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
    <div className="min-h-screen flex items-center justify-center p-4 cyber-grid">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-cyber-accent glow-text mb-4">
            ESCAPE ROOM
          </h1>
          <p className="text-xl text-white text-opacity-70">
            Join an existing game
          </p>
        </div>

        <div className="card fade-in">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus className="text-cyber-accent" size={32} />
            <h2 className="text-3xl font-bold text-white">JOIN GAME</h2>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-white font-bold mb-2">
                ROOM CODE
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                className="input uppercase"
                maxLength={6}
                disabled={loading}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-2">
                YOUR NAME
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="input"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-2">
                UNIQUE IDENTIFIER
              </label>
              <input
                type="text"
                value={playerIdentifier}
                onChange={(e) => setPlayerIdentifier(e.target.value)}
                placeholder="Roll number / Phone / Email"
                className="input"
                disabled={loading}
              />
              <p className="text-white text-opacity-50 text-sm mt-1">
                This ensures you can only join from one device
              </p>
            </div>

            {error && (
              <div className="bg-cyber-danger bg-opacity-20 p-4 rounded-lg border border-cyber-danger">
                <p className="text-cyber-danger">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {loading ? "JOINING..." : "JOIN GAME"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-cyber-border">
            <button
              onClick={() => navigate("/")}
              className="btn-secondary w-full"
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
