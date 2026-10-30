import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { logout } from "../../firebase/auth.js";
import { deleteGym } from "../../firebase/firestore.js";
import Icon from "../ui/Icon.jsx";

const PUBLIC_PATHS = new Set(["/", "/login", "/create-gym", "/rankings"]);

function isAppRoute(pathname) {
  return (
    pathname === "/dashboard" ||
    pathname.startsWith("/members") ||
    pathname === "/plans" ||
    pathname === "/blacklist"
  );
}

const iconBtn =
  "h-10 w-10 rounded-full flex items-center justify-center text-ink-300 hover:bg-ink-700/70 hover:text-ink-50 transition-colors";

export default function Navbar() {
  const { user, gym, setGym } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isPublicPage = PUBLIC_PATHS.has(location.pathname);
  const showGymActions = Boolean(user && gym && isAppRoute(location.pathname));
  const showUserMenu = Boolean(
    user && !gym && location.pathname === "/create-gym",
  );
  const hasMenu = showGymActions || showUserMenu;
  const showBack = ["/login", "/create-gym", "/rankings"].includes(
    location.pathname,
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate("/");
  };

  const handleDeleteGym = async () => {
    setMenuOpen(false);
    if (!user?.uid || !gym?.id) return;
    const confirmed = window.confirm(
      `Delete "${gym.gymName}" and all its data? This cannot be undone.`,
    );
    if (!confirmed) return;
    await deleteGym(gym.id, user.uid);
    setGym(null);
    navigate("/create-gym");
  };

  return (
    <nav className="sticky top-0 z-40 bg-ink-900 border-b border-ink-700/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <Link
          to={gym ? "/dashboard" : isPublicPage ? "/" : "/login"}
          className="flex items-center gap-2.5 min-w-0"
        >
          {showGymActions ? (
            <>
              <span className="h-8 w-8 rounded-[10px] bg-gradient-to-br from-copper-400 to-copper-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                {gym.gymName?.trim()?.[0]?.toUpperCase() || "G"}
              </span>
              <span className="font-semibold text-[17px] tracking-tight truncate max-w-[180px] sm:max-w-xs">
                {gym.gymName}
              </span>
            </>
          ) : (
            <>
              <img
                src="/gymZ.webp"
                alt="Gym-Z"
                className="h-8 w-8 rounded-[10px] object-cover shrink-0"
              />
              <span className="font-bold text-[17px] tracking-tight">
                Gym<span className="text-copper-400">-Z</span>
              </span>
            </>
          )}
        </Link>

        <div className="flex items-center gap-1">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-0.5 text-sm font-medium text-copper-400 pl-1 pr-3 h-10"
            >
              <Icon name="chevronLeft" size={18} strokeWidth={2.2} />
              Back
            </button>
          ) : !showGymActions ? (
            <Link
              to="/rankings"
              className="text-sm font-medium text-copper-400 px-3 h-10 inline-flex items-center"
            >
              Rankings
            </Link>
          ) : null}

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={iconBtn}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={19} />
          </button>

          {hasMenu ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={showGymActions ? "Gym menu" : "Account menu"}
                aria-expanded={menuOpen}
                className={iconBtn}
              >
                <Icon name="more" size={20} />
              </button>
              {menuOpen ? (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-ink-700/60 bg-ink-800 shadow-sheet p-1.5 z-50 animate-fade-up">
                  {showGymActions && (
                    <button
                      onClick={handleDeleteGym}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-vitality-critical hover:bg-ink-700/60 transition-colors"
                    >
                      <Icon name="trash" size={17} />
                      Delete Gym
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-50 hover:bg-ink-700/60 transition-colors"
                  >
                    <Icon name="logout" size={17} />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
