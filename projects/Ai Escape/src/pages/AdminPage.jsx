import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Copy, Check } from "lucide-react";
import { createGameRoom } from "../services/gameService";

/**
 * Admin Page - for creating a new game room
 */
export default function AdminPage() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    if (!adminName.trim()) {
      setError("Admin name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const code = await createGameRoom(adminName.trim());
      setRoomCode(code);

      // Store admin data in sessionStorage
      sessionStorage.setItem("roomCode", code);
      sessionStorage.setItem("adminName", adminName.trim());
      sessionStorage.setItem("isAdmin", "true");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    navigate("/game");
  };

  if (roomCode) {
    return (
      <div className="viewport-container flex items-center justify-center cyber-grid overflow-y-auto">
        <div className="w-full max-w-md px-4 py-3 md:py-4">
          <div className="card fade-in text-center p-4 md:p-5">
            <div className="mb-3 md:mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-cyber-accent rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <Shield size={24} className="md:hidden text-black" />
                <Shield size={32} className="hidden md:block text-black" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-cyber-accent glow-text mb-1">
                ROOM CREATED!
              </h2>
              <p className="text-xs md:text-sm text-white text-opacity-70">
                Share this code with players
              </p>
            </div>

            <div className="bg-cyber-bg p-3 md:p-4 rounded-lg border-2 border-cyber-accent mb-3 md:mb-4">
              <p className="text-white text-opacity-70 mb-1.5 text-xs md:text-sm">Room Code</p>
              <div className="text-3xl md:text-4xl font-bold text-cyber-accent glow-text mb-2 md:mb-3 tracking-wider">
                {roomCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="btn-secondary flex items-center justify-center gap-2 w-full text-xs md:text-sm py-2"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    COPIED!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    COPY CODE
                  </>
                )}
              </button>
            </div>

            <button onClick={handleContinue} className="btn-primary w-full text-sm md:text-base py-2.5 mb-3">
              CONTINUE TO GAME ROOM →
            </button>

            <div className="bg-cyber-warning bg-opacity-10 p-2 md:p-3 rounded-lg border border-cyber-warning">
              <p className="text-cyber-warning text-xs">
                💡 Players can join using the code above. Configure game settings next.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="viewport-container flex items-center justify-center cyber-grid overflow-y-auto">
      <div className="w-full max-w-md px-4 py-3 md:py-4">
        <div className="text-center mb-3 md:mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyber-accent glow-text mb-1 md:mb-2">
            ESCAPE ROOM
          </h1>
          <p className="text-xs md:text-sm text-white text-opacity-70">
            Create a new game
          </p>
        </div>

        <div className="card fade-in p-4 md:p-5">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Shield className="text-cyber-accent" size={20} />
            <h2 className="text-lg md:text-xl font-bold text-white">ADMIN SETUP</h2>
          </div>

          <form onSubmit={handleCreateRoom} className="space-y-2.5 md:space-y-3">
            <div>
              <label className="block text-white font-bold mb-1 text-xs md:text-sm">
                ADMIN NAME
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Enter your name"
                className="input text-sm md:text-base"
                disabled={loading}
                autoFocus
              />
              <p className="text-white text-opacity-50 text-xs mt-0.5">
                You will be the game master
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
              className="btn-primary w-full text-sm md:text-base py-2.5"
            >
              {loading ? "CREATING ROOM..." : "CREATE GAME ROOM"}
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
