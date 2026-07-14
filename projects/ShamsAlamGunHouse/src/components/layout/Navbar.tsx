import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrolled } from '@/hooks/useScrolled'
import { siteConfig } from '@/data/siteConfig'
import { LinkButton } from '@/components/ui/Button'

const navLinks = [
  { label: 'Legacy', href: '#legacy' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Restorations', href: '#restorations' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Shop', href: '#shop' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
]

/**
 * Sticky navigation bar. Transparent over the hero image, and switches
 * to a blurred glass panel once the user scrolls past the hero.
 * Add or remove sections by editing `navLinks` above — anchors must
 * match the `id` prop on the corresponding section component.
 */
export function Navbar() {
  const scrolled = useScrolled(60)
  const [open, setOpen] = useState(false)

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-panel shadow-soft' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="container-px flex items-center justify-between h-20">
        <a href="#home" className="font-display text-xl sm:text-2xl tracking-wide text-ivory">
          {siteConfig.shopName}
        </a>

        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-mono text-xs uppercase tracking-widest2 text-ash transition-colors hover:text-brass-light"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <LinkButton href="#contact" variant="ghost" className="hidden lg:inline-flex !py-2.5 !px-6">
          Book a Service
        </LinkButton>

        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-ivory p-2 -mr-2"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass-panel overflow-hidden"
          >
            <ul className="container-px flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-mono text-sm uppercase tracking-widest2 text-ash hover:text-brass-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
