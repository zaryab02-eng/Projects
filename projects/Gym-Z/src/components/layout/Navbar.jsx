import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { logout } from "../../firebase/auth.js";
import { deleteGym, updateGym } from "../../firebase/firestore.js";
import { DEFAULT_GRACE_PERIOD_DAYS } from "../../utils/streakUtils.js";
import Modal from "../ui/Modal.jsx";
import Button from "../ui/Button.jsx";

const PUBLIC_PATHS = new Set(["/", "/login", "/create-gym", "/rankings"]);

function isAppRoute(pathname) {
  return (
    pathname === "/dashboard" ||
    pathname.startsWith("/members") ||
    pathname === "/plans" ||
    pathname === "/blacklist"
  );
}

export default function Navbar() {
  const { user, gym, setGym, refreshGym } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isPublicPage = PUBLIC_PATHS.has(location.pathname);
  const showGymActions = Boolean(user && gym && isAppRoute(location.pathname));
  const showBack = ["/login", "/create-gym", "/rankings"].includes(
    location.pathname,
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [graceInput, setGraceInput] = useState("30");
  const [savingSettings, setSavingSettings] = useState(false);
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

  const openSettings = () => {
    setMenuOpen(false);
    setGraceInput(String(gym?.gracePeriodDays ?? DEFAULT_GRACE_PERIOD_DAYS));
    setSettingsOpen(true);
  };

  const handleSaveSettings = async () => {
    if (!gym?.id) return;
    const days = Math.max(
      1,
      parseInt(graceInput, 10) || DEFAULT_GRACE_PERIOD_DAYS,
    );
    setSavingSettings(true);
    try {
      await updateGym(gym.id, { gracePeriodDays: days });
      await refreshGym();
      setSettingsOpen(false);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-ink-900/85 border-b border-ink-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to={gym ? "/dashboard" : isPublicPage ? "/" : "/login"}
          className="flex items-center gap-2 min-w-0"
        >
          {showGymActions ? (
            <span className="font-display italic text-lg tracking-wide truncate max-w-[180px] sm:max-w-xs">
              {gym.gymName}
            </span>
          ) : (
            <span className="font-display italic text-lg tracking-wide text-copper-400">
              Gym-Z
            </span>
          )}
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="text-sm font-semibold text-steel-300 hover:text-steel-200 px-3 py-2"
            >
              ← Back
            </button>
          ) : !showGymActions ? (
            <Link
              to="/rankings"
              className="text-sm font-semibold text-steel-300 hover:text-steel-200 px-3 py-2"
            >
              Rankings
            </Link>
          ) : null}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-9 w-9 rounded-lg border border-ink-700 flex items-center justify-center hover:bg-ink-800 transition-colors"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          {showGymActions ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Gym menu"
                aria-expanded={menuOpen}
                className="h-9 w-9 rounded-lg border border-ink-700 flex items-center justify-center hover:bg-ink-800 transition-colors"
              >
                ⋮
              </button>
              {menuOpen ? (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-ink-700 bg-ink-800 shadow-card py-1 overflow-hidden">
                  <button
                    onClick={openSettings}
                    className="w-full text-left px-4 py-2.5 text-sm text-ink-50 hover:bg-ink-700 transition-colors"
                  >
                    Renewal Settings
                  </button>
                  <button
                    onClick={handleDeleteGym}
                    className="w-full text-left px-4 py-2.5 text-sm text-vitality-critical hover:bg-ink-700 transition-colors"
                  >
                    Delete Gym
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-ink-50 hover:bg-ink-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <Modal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Renewal Settings"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase text-ink-500">
              Grace Period (days)
            </label>
            <input
              type="number"
              min="1"
              value={graceInput}
              onChange={(e) => setGraceInput(e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink-700 bg-ink-900 px-3 py-2 text-sm focus:outline-none focus:border-copper-500"
            />
            <p className="text-xs text-ink-500 mt-2">
              If a member renews within this many days after their membership
              expires, their Loyalty Streak continues. Beyond this, it resets.
            </p>
          </div>
          <Button
            className="w-full"
            loading={savingSettings}
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
        </div>
      </Modal>
    </nav>
  );
}
