import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { logout } from "../../firebase/auth.js";
import { deleteGym } from "../../firebase/firestore.js";
import Button from "../ui/Button.jsx";

export default function Navbar() {
  const { user, gym } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = ["/login", "/forgot-password", "/create-gym"].includes(
    location.pathname,
  );

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleDeleteGym = async () => {
    if (!user?.uid || !gym?.id) return;
    await deleteGym(gym.id, user.uid);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-ink-900/85 border-b border-ink-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-2"
        >
          <span className="h-8 w-8 rounded-lg bg-copper-500 flex items-center justify-center font-display font-bold text-white">
            Z
          </span>
          <span className="font-display text-lg tracking-wide hidden sm:inline">
            GYM-Z
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="text-sm font-semibold text-steel-300 hover:text-steel-200 px-3 py-2"
            >
              ← Back
            </button>
          ) : (
            <Link
              to="/rankings"
              className="text-sm font-semibold text-steel-300 hover:text-steel-200 px-3 py-2"
            >
              Rankings
            </Link>
          )}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-9 w-9 rounded-lg border border-ink-700 flex items-center justify-center hover:bg-ink-800 transition-colors"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          {user ? (
            <>
              <span className="hidden md:inline text-sm text-ink-500 truncate max-w-[140px]">
                {gym?.gymName}
              </span>
              <Button variant="ghost" size="sm" onClick={handleDeleteGym}>
                Delete Gym
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
