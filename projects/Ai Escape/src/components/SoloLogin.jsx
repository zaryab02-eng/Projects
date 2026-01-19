import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, getCurrentUser, onAuthChange } from "../services/authService";
import { LogIn, User } from "lucide-react";

/**
 * Solo Login Component - Google authentication and display name entry
 */
export default function SoloLogin({ onLoginComplete }) {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Check if display name is already set
      const savedDisplayName = localStorage.getItem(`solo_displayName_${currentUser.uid}`);
      if (savedDisplayName) {
        setDisplayName(savedDisplayName);
      }
    }

    // Listen for auth state changes
    const unsubscribe = onAuthChange((authUser) => {
      if (authUser) {
        setUser(authUser);
        const savedDisplayName = localStorage.getItem(`solo_displayName_${authUser.uid}`);
        if (savedDisplayName) {
          setDisplayName(savedDisplayName);
        }
      } else {
        setUser(null);
        setDisplayName("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithGoogle();
      setUser(result.user);
      
      // Check if display name was previously saved
      const savedDisplayName = localStorage.getItem(`solo_displayName_${result.user.uid}`);
      if (savedDisplayName) {
        setDisplayName(savedDisplayName);
      }
    } catch (err) {
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!displayName.trim()) {
      setError("Please enter a display name");
      return;
    }

    if (!user) {
      setError("Please sign in with Google first");
      return;
    }

    // Save display name for this user
    localStorage.setItem(`solo_displayName_${user.uid}`, displayName.trim());
    
    // Call callback with user info
    onLoginComplete({
      uid: user.uid,
      displayName: displayName.trim(),
    });
  };

  return (
    <div className="viewport-container flex items-center justify-center cyber-grid overflow-y-auto">
      <div className="w-full max-w-2xl px-4 py-3 md:py-4">
        <div className="text-center mb-3 md:mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyber-accent glow-text mb-1 md:mb-2">
            SOLO MODE LOGIN
          </h1>
          <p className="text-xs md:text-sm text-white text-opacity-70">
            Sign in to compete on the leaderboard
          </p>
        </div>

        <div className="card fade-in p-4 md:p-5">
          {!user ? (
            <div className="space-y-3 md:space-y-4">
              <div className="text-center">
                <p className="text-white text-opacity-70 mb-4 text-sm md:text-base">
                  Solo mode requires Google login to track your progress on the leaderboard.
                </p>
              </div>

              {error && (
                <div className="bg-cyber-danger bg-opacity-20 p-2 md:p-3 rounded-lg border border-cyber-danger">
                  <p className="text-cyber-danger text-xs md:text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm md:text-base py-2.5"
              >
                <LogIn size={16} />
                {loading ? "SIGNING IN..." : "SIGN IN WITH GOOGLE"}
              </button>

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
          ) : (
            <div className="space-y-3 md:space-y-4">
              <div className="bg-cyber-bg bg-opacity-50 p-3 md:p-4 rounded-lg border border-cyber-accent">
                <div className="flex items-center gap-2 mb-2">
                  <User className="text-cyber-accent" size={20} />
                  <p className="text-white font-bold text-sm md:text-base">Signed in as:</p>
                </div>
                <p className="text-cyber-accent text-sm md:text-base break-all">
                  {user.email}
                </p>
              </div>

              <div>
                <label className="block text-white font-bold mb-1 text-xs md:text-sm">
                  DISPLAY NAME
                </label>
                <p className="text-white text-opacity-60 text-xs mb-2">
                  This name will appear on the leaderboard (no email or identifiers shown)
                </p>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  className="input text-sm md:text-base"
                  disabled={loading}
                  autoFocus
                  maxLength={30}
                />
              </div>

              {error && (
                <div className="bg-cyber-danger bg-opacity-20 p-2 md:p-3 rounded-lg border border-cyber-danger">
                  <p className="text-cyber-danger text-xs md:text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleContinue}
                disabled={loading || !displayName.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm md:text-base py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <User size={16} />
                CONTINUE TO GAME SETUP
              </button>

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
          )}
        </div>
      </div>
    </div>
  );
}
