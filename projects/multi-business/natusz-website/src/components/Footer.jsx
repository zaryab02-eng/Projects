import { Link, useLocation } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Linkedin,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Logo from "./Logo";
import { navLinks } from "./Navbar";
import { site } from "../config/site";
import { generalEnquiryLink } from "../lib/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";

export default function Footer() {
  const { pathname } = useLocation();
  // The About page already shows the contact details, so its footer is kept short:
  // logo, short description and the disclaimer only.
  const minimal = pathname === "/about";

  const socials = [
    { href: site.social.instagram, Icon: Instagram, label: "Instagram" },
    { href: site.social.facebook, Icon: Facebook, label: "Facebook" },
    { href: site.social.linkedin, Icon: Linkedin, label: "LinkedIn" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-ink text-paper">
      <div className="container-x py-12 sm:py-20">
        <div className={minimal ? "" : "grid gap-10 sm:gap-12 lg:grid-cols-12"}>
          <div className="lg:col-span-5">
            <Logo
              layout="stacked"
              tone="light"
              className="h-28 w-auto sm:h-36"
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/65 sm:mt-6">
              Marketing carefully chosen skin care and dermatology products,
              with honest information and a real person on the other end of
              every message.
            </p>
            {!minimal && (
              <a
                href={generalEnquiryLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-rose mt-6 sm:mt-7"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Message us on WhatsApp
              </a>
            )}
          </div>

          {!minimal && (
            <>
              <div className="lg:col-span-3 lg:col-start-7">
                <h3 className="font-display text-xl text-paper">Explore</h3>
                <ul className="mt-4 space-y-3 text-sm text-paper/70 sm:mt-5">
                  {navLinks.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="transition hover:text-paper">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-3">
                <h3 className="font-display text-xl text-paper">Reach us</h3>
                <ul className="mt-4 space-y-4 text-sm text-paper/70 sm:mt-5">
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
            </>
          )}
        </div>

        <div
          className={`border-t border-white/10 pt-6 text-xs leading-relaxed text-paper/50 ${minimal ? "mt-8" : "mt-10 sm:mt-14"}`}
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
