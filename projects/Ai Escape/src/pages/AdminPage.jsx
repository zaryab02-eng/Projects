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
      <div className="viewport-container flex items-center justify-center cyber-grid">
        <div className="w-full max-w-md px-4 py-6 overflow-y-auto">
          <div className="card fade-in text-center">
            <div className="mb-4 md:mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-cyber-accent rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Shield size={32} className="md:hidden text-black" />
                <Shield size={40} className="hidden md:block text-black" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-cyber-accent glow-text mb-2">
                ROOM CREATED!
              </h2>
              <p className="text-sm md:text-base text-white text-opacity-70">
                Share this code with players
              </p>
            </div>

            <div className="bg-cyber-bg p-4 md:p-6 rounded-lg border-2 border-cyber-accent mb-4 md:mb-6">
              <p className="text-white text-opacity-70 mb-2 text-sm md:text-base">Room Code</p>
              <div className="text-4xl md:text-6xl font-bold text-cyber-accent glow-text mb-3 md:mb-4 tracking-wider">
                {roomCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="btn-secondary flex items-center justify-center gap-2 w-full text-sm md:text-base"
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    COPIED!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    COPY CODE
                  </>
                )}
              </button>
            </div>

            <button onClick={handleContinue} className="btn-primary w-full text-sm md:text-base">
              CONTINUE TO GAME ROOM →
            </button>

            <div className="mt-4 md:mt-6 bg-cyber-warning bg-opacity-10 p-3 md:p-4 rounded-lg border border-cyber-warning">
              <p className="text-cyber-warning text-xs md:text-sm">
                💡 Players can join using the code above. You'll configure the
                game settings in the next screen.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="viewport-container flex items-center justify-center cyber-grid">
      <div className="w-full max-w-md px-4 py-6 overflow-y-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-cyber-accent glow-text mb-3 md:mb-4">
            ESCAPE ROOM
          </h1>
          <p className="text-base md:text-xl text-white text-opacity-70">
            Create a new game
          </p>
        </div>

        <div className="card fade-in">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <Shield className="text-cyber-accent" size={24} />
            <h2 className="text-xl md:text-3xl font-bold text-white">ADMIN SETUP</h2>
          </div>

          <form onSubmit={handleCreateRoom} className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-white font-bold mb-2 text-sm md:text-base">
                ADMIN NAME
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Enter your name"
                className="input text-lg"
                disabled={loading}
                autoFocus
              />
              <p className="text-white text-opacity-50 text-xs md:text-sm mt-1">
                You will be the game master
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
              className="btn-primary w-full text-sm md:text-base"
            >
              {loading ? "CREATING ROOM..." : "CREATE GAME ROOM"}
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
