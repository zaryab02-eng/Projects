// Desktop-only side navigation (hidden on mobile in favor of BottomNav).
import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/members', label: 'Members', icon: '👥' },
  { to: '/members/add', label: 'Add Member', icon: '➕' },
  { to: '/plans', label: 'Membership Plans', icon: '📋' },
  { to: '/blacklist', label: 'Blacklist', icon: '🚫' },
  { to: '/rankings', label: 'Gym Rankings', icon: '🏆' }
]

export default function Sidebar() {
  return (
    <aside className="hidden sm:flex flex-col w-60 shrink-0 border-r border-ink-800 min-h-[calc(100vh-4rem)] py-6 px-3 gap-1">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-copper-500/15 text-copper-400' : 'text-ink-50 hover:bg-ink-800'
            }`
          }
        >
          <span>{link.icon}</span>{link.label}
        </NavLink>
      ))}
    </aside>
  )
}
