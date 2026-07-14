import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFloatButton } from '@/components/layout/WhatsAppFloatButton'
import Home from '@/pages/Home'

/**
 * App shell: router + persistent layout (Navbar, WhatsApp button, Footer)
 * wrapping whichever route is active.
 *
 * To add a new page (e.g. a dedicated Blog page), create it under
 * `src/pages/`, then add a <Route> below — see README "How to add new
 * pages" for a full walkthrough.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <WhatsAppFloatButton />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
