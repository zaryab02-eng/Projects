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
      <div className="min-h-screen flex items-center justify-center p-4 cyber-grid">
        <div className="w-full max-w-md">
          <div className="card fade-in text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-cyber-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={40} className="text-black" />
              </div>
              <h2 className="text-3xl font-bold text-cyber-accent glow-text mb-2">
                ROOM CREATED!
              </h2>
              <p className="text-white text-opacity-70">
                Share this code with players
              </p>
            </div>

            <div className="bg-cyber-bg p-6 rounded-lg border-2 border-cyber-accent mb-6">
              <p className="text-white text-opacity-70 mb-2">Room Code</p>
              <div className="text-6xl font-bold text-cyber-accent glow-text mb-4 tracking-wider">
                {roomCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="btn-secondary flex items-center justify-center gap-2 w-full"
              >
                {copied ? (
                  <>
                    <Check size={20} />
                    COPIED!
                  </>
                ) : (
                  <>
                    <Copy size={20} />
                    COPY CODE
                  </>
                )}
              </button>
            </div>

            <button onClick={handleContinue} className="btn-primary w-full">
              CONTINUE TO GAME ROOM →
            </button>

            <div className="mt-6 bg-cyber-warning bg-opacity-10 p-4 rounded-lg border border-cyber-warning">
              <p className="text-cyber-warning text-sm">
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
    <div className="min-h-screen flex items-center justify-center p-4 cyber-grid">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-cyber-accent glow-text mb-4">
            ESCAPE ROOM
          </h1>
          <p className="text-xl text-white text-opacity-70">
            Create a new game
          </p>
        </div>

        <div className="card fade-in">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-cyber-accent" size={32} />
            <h2 className="text-3xl font-bold text-white">ADMIN SETUP</h2>
          </div>

          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div>
              <label className="block text-white font-bold mb-2">
                ADMIN NAME
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Enter your name"
                className="input"
                disabled={loading}
                autoFocus
              />
              <p className="text-white text-opacity-50 text-sm mt-1">
                You will be the game master
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
              className="btn-primary w-full"
            >
              {loading ? "CREATING ROOM..." : "CREATE GAME ROOM"}
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
