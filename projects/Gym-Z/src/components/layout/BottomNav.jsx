// Mobile + tablet tab bar with a raised "Add" action in the center.
import { Link, useLocation } from "react-router-dom";
import Icon from "../ui/Icon.jsx";

const LEFT = [
  {
    to: "/dashboard",
    label: "Home",
    icon: "home",
    match: (p) => p === "/dashboard",
  },
  {
    to: "/members",
    label: "Members",
    icon: "users",
    match: (p) => p.startsWith("/members") && p !== "/members/add",
  },
];
const RIGHT = [
  { to: "/plans", label: "Plans", icon: "card", match: (p) => p === "/plans" },
  {
    to: "/blacklist",
    label: "Blacklist",
    icon: "ban",
    match: (p) => p === "/blacklist",
  },
];

function Tab({ tab, pathname }) {
  const active = tab.match(pathname);
  return (
    <Link
      to={tab.to}
      className={`flex flex-col items-center gap-1 pt-2.5 pb-1.5 text-[10px] font-semibold transition-colors ${
        active ? "text-copper-400" : "text-ink-500"
      }`}
    >
      <Icon name={tab.icon} size={23} strokeWidth={active ? 2.1 : 1.7} />
      {tab.label}
    </Link>
  );
}

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-ink-900 border-t border-ink-700/60 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 items-end max-w-lg mx-auto">
        {LEFT.map((t) => (
          <Tab key={t.to} tab={t} pathname={pathname} />
        ))}
        <div className="flex justify-center">
          <Link
            to="/members/add"
            aria-label="Add member"
            className="-mt-5 h-14 w-14 rounded-full bg-copper-500 text-white flex items-center justify-center ring-4 ring-ink-900 shadow-[0_8px_20px_-6px_rgba(232,93,18,0.65)] active:scale-95 transition-transform"
          >
            <Icon name="plus" size={26} strokeWidth={2.4} />
          </Link>
        </div>
        {RIGHT.map((t) => (
          <Tab key={t.to} tab={t} pathname={pathname} />
        ))}
      </div>
    </nav>
  );
}
