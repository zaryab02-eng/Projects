// Wraps every authenticated page with Navbar + Sidebar (desktop) / BottomNav
// (mobile) + Footer, so pages only need to render their own content.
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'
import BottomNav from './BottomNav.jsx'
import Footer from './Footer.jsx'

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-ink-900">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 px-4 sm:px-6 py-6 pb-24 sm:pb-6 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
      <BottomNav />
      <Footer />
    </div>
  )
}
