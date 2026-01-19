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
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-cyber-accent glow-text mb-2 md:mb-3 leading-tight tracking-tight">
            ESCAPE ROOM
          </h1>
          <p className="text-xs md:text-base text-white text-opacity-80 font-medium">
            Join an existing game
          </p>
        </div>

        <div className="card fade-in p-5 md:p-6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <UserPlus className="text-cyber-accent" size={24} />
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">JOIN GAME</h2>
          </div>

          <form onSubmit={handleJoin} className="space-y-4 md:space-y-5">
            <div>
              <label className="block text-white font-bold mb-2 text-sm md:text-base">
                ROOM CODE
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                className="input uppercase text-sm md:text-base rounded-xl"
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
                className="input text-sm md:text-base rounded-xl"
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
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/\D/g, '');
                  // Limit to 10 digits
                  if (value.length <= 10) {
                    setPlayerIdentifier(value);
                  }
                }}
                placeholder="Enter 10-digit number"
                className="input text-sm md:text-base rounded-xl"
                disabled={loading}
                maxLength={10}
              />
              <p className="text-white text-opacity-70 text-xs md:text-sm mt-2">
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
              className="btn-primary w-full flex items-center justify-center gap-2 text-sm md:text-base py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <LogIn size={18} />
              {loading ? "JOINING..." : "JOIN GAME"}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-cyber-border">
            <button
              onClick={() => navigate("/")}
              className="btn-secondary w-full text-xs md:text-sm py-2.5 rounded-xl"
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
