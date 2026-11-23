import { useLocation } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import Logo from "./Logo";
import { site } from "../config/site";

export default function Footer() {
  const { pathname } = useLocation();
  // About and Contact already show the contact details on the page itself,
  // so their footer is kept short: logo, description and the disclaimer only.
  const minimal = pathname === "/about" || pathname === "/contact";

  const socials = [
    { href: site.social.instagram, Icon: Instagram, label: "Instagram" },
    { href: site.social.facebook, Icon: Facebook, label: "Facebook" },
    { href: site.social.linkedin, Icon: Linkedin, label: "LinkedIn" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-ink text-paper">
      <div className="container-x py-12 sm:py-16">
        <div className={minimal ? "" : "grid gap-10 lg:grid-cols-12 lg:gap-12"}>
          <div className="lg:col-span-6">
            <Logo
              layout="stacked"
              tone="light"
              className="h-28 w-auto sm:h-32"
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/65">
              Marketing carefully chosen skin care and dermatology products,
              with honest information and a real person on the other end of
              every message.
            </p>
          </div>

          {!minimal && (
            <div className="lg:col-span-5 lg:col-start-8">
              <h3 className="font-display text-xl text-paper">Reach us</h3>
              <ul className="mt-4 space-y-4 text-sm text-paper/70">
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <a
                    href={`tel:${site.phoneTel}`}
                    className="transition hover:text-paper"
                  >
                    {site.phoneDisplay}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <a
                    href={`mailto:${site.email}`}
                    className="break-all transition hover:text-paper"
                  >
                    {site.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span>{site.address.lines.join(" ")}</span>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span>{site.hours}</span>
                </li>
              </ul>
              {socials.length > 0 && (
                <div className="mt-6 flex gap-3">
                  {socials.map(({ href, Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:bg-white/10"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className={`border-t border-white/10 pt-6 text-xs leading-relaxed text-paper/50 ${minimal ? "mt-8" : "mt-10"}`}
        >
          <p className="max-w-3xl">
            The information on this website is for general awareness and does
            not replace medical advice. Prescription products should be used
            only on the advice of a registered medical practitioner.
          </p>
          <p className="mt-3">
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
