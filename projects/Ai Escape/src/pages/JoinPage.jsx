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

    // Validate unique identifier is exactly 10 digits
    if (!/^\d{10}$/.test(playerIdentifier.trim())) {
      setError("Unique identifier must be exactly 10 digits");
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
    <div className="viewport-container flex items-center justify-center cyber-grid overflow-y-auto">
      <div className="w-full max-w-md px-4 py-3 md:py-4">
        <div className="text-center mb-3 md:mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyber-accent glow-text mb-1 md:mb-2">
            ESCAPE ROOM
          </h1>
          <p className="text-xs md:text-sm text-white text-opacity-70">
            Join an existing game
          </p>
        </div>

        <div className="card fade-in p-4 md:p-5">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <UserPlus className="text-cyber-accent" size={20} />
            <h2 className="text-lg md:text-xl font-bold text-white">JOIN GAME</h2>
          </div>

          <form onSubmit={handleJoin} className="space-y-2.5 md:space-y-3">
            <div>
              <label className="block text-white font-bold mb-1 text-xs md:text-sm">
                ROOM CODE
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                className="input uppercase text-sm md:text-base"
                maxLength={6}
                disabled={loading}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-1 text-xs md:text-sm">
                YOUR NAME
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="input text-sm md:text-base"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-1 text-xs md:text-sm">
                UNIQUE IDENTIFIER
              </label>
              <input
                type="text"
                value={playerIdentifier}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/\D/g, '');
                  // Limit to 10 digits
                  if (value.length <= 10) {
                    setPlayerIdentifier(value);
                  }
                }}
                placeholder="Enter 10-digit number"
                className="input text-sm md:text-base"
                disabled={loading}
                maxLength={10}
              />
              <p className="text-white text-opacity-50 text-xs mt-0.5">
                Enter 10-digit number only
              </p>
            </div>

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
              <LogIn size={16} />
              {loading ? "JOINING..." : "JOIN GAME"}
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
