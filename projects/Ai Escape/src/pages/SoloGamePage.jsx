import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Play, Pencil, X, Check, LogOut } from "lucide-react";
import { createGameRoom, joinGameRoom, setGameConfig, startGame } from "../services/gameService";
import GameRoom from "../components/GameRoom";
import SoloLogin from "../components/SoloLogin";
import { updateSoloDisplayNameEverywhere } from "../services/leaderboardService";
import { signOutUser, getCurrentUser, onAuthChange } from "../services/authService";

/**
 * Solo Game Page - for single player to play alone
 * Requires Google login and display name
 */
function getSoloDurationMinutes(difficulty, levels) {
  // Map requested solo limits to minutes
  if (difficulty === "Easy" && levels === 5) return 5;
  if (difficulty === "Easy" && levels === 10) return 10;
  if (difficulty === "Medium" && levels === 5) return 15;
  if (difficulty === "Medium" && levels === 10) return 20;
  if (difficulty === "Hard" && levels === 5) return 25;
  if (difficulty === "Hard" && levels === 10) return 30;
  // Fallback safety (should never hit)
  return 10;
}

export default function SoloGamePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [difficulty, setDifficulty] = useState("Medium");
  const [totalLevels, setTotalLevels] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  // Wait for Firebase auth to initialize before showing login
  useEffect(() => {
    // Check initial auth state
    const currentUser = getCurrentUser();
    if (currentUser) {
      const savedDisplayName = localStorage.getItem(`solo_displayName_${currentUser.uid}`);
      if (savedDisplayName) {
        setUser({
          uid: currentUser.uid,
          displayName: savedDisplayName,
        });
        setNameDraft(savedDisplayName);
      }
    }

    // Listen for auth state changes (this will fire once when auth initializes)
    const unsubscribe = onAuthChange((authUser) => {
      if (authUser) {
        const savedDisplayName = localStorage.getItem(`solo_displayName_${authUser.uid}`);
        if (savedDisplayName) {
          setUser({
            uid: authUser.uid,
            displayName: savedDisplayName,
          });
          setNameDraft(savedDisplayName);
        }
      } else {
        setUser(null);
        setNameDraft("");
      }
      // Mark auth as initialized after first callback
      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginComplete = (userData) => {
    setUser(userData);
    setNameDraft(userData?.displayName || "");
  };

  const handleSaveName = async () => {
    if (!user?.uid) return;
    const trimmed = (nameDraft || "").trim();
    if (!trimmed) {
      setError("Name cannot be empty");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Persist locally (used for future solo auto-login)
      localStorage.setItem(`solo_displayName_${user.uid}`, trimmed);

      // Update all global leaderboards + global player profile
      await updateSoloDisplayNameEverywhere(user.uid, trimmed);

      // Update current in-memory user
      setUser((prev) => ({ ...(prev || {}), displayName: trimmed }));
      setIsEditingName(false);
    } catch (err) {
      setError(err.message || "Failed to update name");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError("");
    try {
      sessionStorage.clear();
      await signOutUser();
      setUser(null);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to sign out");
    } finally {
      setLoading(false);
    }
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
      const soloDuration = getSoloDurationMinutes(difficulty, totalLevels);

      // Create a room
      const code = await createGameRoom(`Solo-${user.displayName}`);
      setRoomCode(code);

      // Use user UID as identifier for solo mode
      const pid = await joinGameRoom(code, `solo-${user.uid}`, user.displayName);

      // Set game configuration with bounded solo durations
      await setGameConfig(code, difficulty, soloDuration, totalLevels);

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

  // Show loading spinner while auth initializes (prevents flash of login page)
  if (!authInitialized) {
    return (
      <div className="viewport-container flex items-center justify-center cyber-grid">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-accent mb-4"></div>
          <p className="text-white text-opacity-70 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not logged in (only after auth has initialized)
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
        <div className="mb-3 md:mb-4">
          {/* Top actions row (never overlaps title on mobile) */}
          <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-cyber-surface border border-cyber-border rounded-lg hover:border-cyber-accent transition-all duration-300 text-xs"
              disabled={loading}
              title="Sign out"
            >
              <LogOut size={14} />
              <span>SIGN OUT</span>
            </button>

            {!isEditingName ? (
              <button
                type="button"
                onClick={() => {
                  setNameDraft(user?.displayName || "");
                  setIsEditingName(true);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-cyber-surface border border-cyber-accent rounded-lg hover:bg-cyber-accent hover:bg-opacity-20 transition-all duration-300 text-xs"
                disabled={loading}
                title="Edit your display name (updates leaderboard too)"
              >
                <Pencil size={14} />
                <span>EDIT NAME</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                <input
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  className="input text-xs py-1 px-2 w-40 sm:w-48"
                  maxLength={30}
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="inline-flex items-center justify-center w-8 h-8 bg-cyber-surface border border-cyber-accent rounded-lg hover:bg-cyber-accent hover:bg-opacity-20 transition-all duration-300"
                  disabled={loading || !(nameDraft || "").trim()}
                  title="Save"
                >
                  <Check size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingName(false);
                    setNameDraft(user?.displayName || "");
                  }}
                  className="inline-flex items-center justify-center w-8 h-8 bg-cyber-surface border border-cyber-border rounded-lg hover:border-cyber-accent transition-all duration-300"
                  disabled={loading}
                  title="Cancel"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyber-accent glow-text mb-1 md:mb-2">
            SOLO GAME SETUP
          </h1>
          <p className="text-xs md:text-sm text-white text-opacity-70">
            Choose your challenge
          </p>
          </div>
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
