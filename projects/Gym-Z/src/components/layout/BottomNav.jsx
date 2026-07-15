// Mobile-first primary navigation once logged in — mimics a native app's
// tab bar so the installed PWA feels native on Android.
import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/dashboard', label: 'Home', icon: '🏠' },
  { to: '/members', label: 'Members', icon: '👥' },
  { to: '/plans', label: 'Plans', icon: '📋' },
  { to: '/blacklist', label: 'Blacklist', icon: '🚫' }
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-ink-800/95 backdrop-blur-md border-t border-ink-700 sm:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2.5 px-4 text-xs font-medium transition-colors ${
                isActive ? 'text-copper-400' : 'text-ink-500'
              }`
            }
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
