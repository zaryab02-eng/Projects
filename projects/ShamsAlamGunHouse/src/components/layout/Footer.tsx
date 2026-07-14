import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'

const quickLinks = [
  { label: 'Legacy', href: '#legacy' },
  { label: 'Services', href: '#services' },
  { label: 'Restorations', href: '#restorations' },
  { label: 'Shop', href: '#shop' },
  { label: 'Contact', href: '#contact' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 bg-charcoal">
      <div className="container-px py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <p className="font-display text-2xl text-ivory mb-3">{siteConfig.shopName}</p>
          <p className="body-copy text-sm max-w-xs">
            {siteConfig.tagline} — a family workshop trusted across four generations.
          </p>
          <div className="flex gap-4 mt-6">
            <a href={siteConfig.links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-ash hover:text-brass-light transition-colors">
              <Instagram size={18} />
            </a>
            <a href={siteConfig.links.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-ash hover:text-brass-light transition-colors">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-5">Quick Links</p>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="body-copy text-sm hover:text-brass-light transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-5">Contact</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2 body-copy">
              <Phone size={16} className="mt-0.5 text-brass shrink-0" />
              <a href={siteConfig.contact.phoneHref} className="hover:text-brass-light transition-colors">
                {siteConfig.contact.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-2 body-copy">
              <Mail size={16} className="mt-0.5 text-brass shrink-0" />
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-brass-light transition-colors">
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2 body-copy">
              <MapPin size={16} className="mt-0.5 text-brass shrink-0" />
              <span>
                {siteConfig.contact.address.line1}, {siteConfig.contact.address.city},{' '}
                {siteConfig.contact.address.state} {siteConfig.contact.address.pincode}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-5">Business Hours</p>
          <ul className="space-y-2 text-sm">
            {siteConfig.contact.hours.map((slot) => (
              <li key={slot.day} className="flex justify-between gap-4 body-copy">
                <span>{slot.day}</span>
                <span className="text-ivory">{slot.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-px py-6 flex flex-col sm:flex-row gap-3 sm:gap-6 justify-between items-start sm:items-center">
          <p className="text-xs text-ash">
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <p className="text-xs text-ash max-w-2xl">{siteConfig.legalDisclaimer}</p>
        </div>
      </div>
    </footer>
  )
}
