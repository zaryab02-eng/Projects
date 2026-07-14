import { useState } from 'react'
import type { FormEvent } from 'react'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { Button } from '@/components/ui/Button'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

/**
 * Contact form. If VITE_CONTACT_FORM_ENDPOINT is set, submissions POST
 * there as JSON (works with Formspree, Getform, or a custom API). If it
 * is left blank, the form falls back to opening the visitor's email
 * client with the message pre-filled — see README "Contact form endpoint".
 */
export function Contact() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = String(formData.get('name') ?? '')
    const email = String(formData.get('email') ?? '')
    const phone = String(formData.get('phone') ?? '')
    const message = String(formData.get('message') ?? '')

    if (!endpoint) {
      const body = `Name: ${name}%0APhone: ${phone}%0A%0A${message}`
      window.location.href = `mailto:${siteConfig.contact.email}?subject=Website Enquiry&body=${body}`
      return
    }

    try {
      setStatus('submitting')
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) e.currentTarget.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-28 sm:py-36 bg-charcoal">
      <div className="container-px">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Bring Your Firearm In"
          description="Reach out for a quote, a service booking, or just to ask a question — we reply personally, every time."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact form */}
          <RevealOnScroll direction="left" className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="card-surface p-8 sm:p-10 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="eyebrow block mb-2">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full bg-iron border border-white/10 rounded-sm px-4 py-3 text-ivory placeholder:text-ash/50 focus:border-brass outline-none transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="eyebrow block mb-2">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full bg-iron border border-white/10 rounded-sm px-4 py-3 text-ivory placeholder:text-ash/50 focus:border-brass outline-none transition-colors"
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="eyebrow block mb-2">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full bg-iron border border-white/10 rounded-sm px-4 py-3 text-ivory placeholder:text-ash/50 focus:border-brass outline-none transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="eyebrow block mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full bg-iron border border-white/10 rounded-sm px-4 py-3 text-ivory placeholder:text-ash/50 focus:border-brass outline-none transition-colors resize-none"
                  placeholder="Tell us about your firearm and the service you need"
                />
              </div>

              <Button type="submit" disabled={status === 'submitting'} className="w-full sm:w-auto disabled:opacity-60">
                {status === 'submitting' ? 'Sending…' : 'Send Message'}
              </Button>

              {status === 'success' && <p className="text-sm text-brass-light">Thank you — we'll be in touch shortly.</p>}
              {status === 'error' && <p className="text-sm text-red-400">Something went wrong. Please try WhatsApp or phone instead.</p>}
            </form>
          </RevealOnScroll>

          {/* Details + map */}
          <RevealOnScroll direction="right" delay={0.1} className="lg:col-span-2 flex flex-col gap-6">
            <div className="card-surface p-8 space-y-5">
              <a href={siteConfig.contact.phoneHref} className="flex items-start gap-3 group">
                <Phone size={18} className="text-brass mt-0.5 shrink-0" />
                <span className="text-sm text-ash group-hover:text-ivory transition-colors">{siteConfig.contact.phoneDisplay}</span>
              </a>
              <a
                href={siteConfig.contact.whatsappHref('Hello, I would like to enquire about a service.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group"
              >
                <MessageCircle size={18} className="text-brass mt-0.5 shrink-0" />
                <span className="text-sm text-ash group-hover:text-ivory transition-colors">Chat on WhatsApp</span>
              </a>
              <a href={`mailto:${siteConfig.contact.email}`} className="flex items-start gap-3 group">
                <Mail size={18} className="text-brass mt-0.5 shrink-0" />
                <span className="text-sm text-ash group-hover:text-ivory transition-colors">{siteConfig.contact.email}</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-brass mt-0.5 shrink-0" />
                <span className="text-sm text-ash">
                  {siteConfig.contact.address.line1}, {siteConfig.contact.address.line2}
                  <br />
                  {siteConfig.contact.address.city}, {siteConfig.contact.address.state} {siteConfig.contact.address.pincode}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-brass mt-0.5 shrink-0" />
                <div className="text-sm text-ash space-y-1">
                  {siteConfig.contact.hours.map((slot) => (
                    <p key={slot.day}>
                      {slot.day}: <span className="text-ivory">{slot.time}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="card-surface overflow-hidden aspect-[4/3]">
              <iframe
                src={siteConfig.links.googleMapsEmbed}
                title="Workshop location map"
                loading="lazy"
                className="w-full h-full grayscale-[40%] contrast-125"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
