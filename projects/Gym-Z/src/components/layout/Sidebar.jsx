// Desktop-only side navigation (tablet and mobile use BottomNav).
import { Link, useLocation } from "react-router-dom";
import Icon from "../ui/Icon.jsx";

const LINKS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: "home",
    match: (p) => p === "/dashboard",
  },
  {
    to: "/members",
    label: "Members",
    icon: "users",
    match: (p) => p.startsWith("/members") && p !== "/members/add",
  },
  {
    to: "/plans",
    label: "Membership Plans",
    icon: "card",
    match: (p) => p === "/plans",
  },
  {
    to: "/blacklist",
    label: "Blacklist",
    icon: "ban",
    match: (p) => p === "/blacklist",
  },
  {
    to: "/rankings",
    label: "Gym Rankings",
    icon: "trophy",
    match: (p) => p === "/rankings",
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-14 self-start h-[calc(100dvh-3.5rem)] border-r border-ink-700/60 py-6 px-4 gap-1.5">
      <Link
        to="/members/add"
        className="mb-4 inline-flex items-center justify-center gap-2 h-11 rounded-full bg-copper-500 hover:bg-copper-600 text-white text-sm font-semibold transition-colors active:scale-[0.98]"
      >
        <Icon name="plus" size={18} strokeWidth={2.4} />
        Add Member
      </Link>
      {LINKS.map((link) => {
        const active = link.match(pathname);
        return (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-3.5 h-11 rounded-xl text-[14px] font-medium transition-colors ${
              active
                ? "bg-ink-800 text-ink-50 shadow-card border border-ink-700/60"
                : "text-ink-300 hover:bg-ink-800/70 border border-transparent"
            }`}
          >
            <Icon
              name={link.icon}
              size={19}
              className={active ? "text-copper-400" : ""}
            />
            {link.label}
          </Link>
        );
      })}
    </aside>
  );
}
