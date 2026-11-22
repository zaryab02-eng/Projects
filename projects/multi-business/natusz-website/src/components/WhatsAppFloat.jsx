import { useLocation } from "react-router-dom";
import WhatsAppIcon from "./WhatsAppIcon";
import { generalEnquiryLink } from "../lib/whatsapp";

/** Floating WhatsApp button, shown on every page except the Gallery. */
export default function WhatsAppFloat() {
  const { pathname } = useLocation();
  if (pathname === "/gallery") return null;
  return (
    <a
      href={generalEnquiryLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Natusz Healthcare on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(6,42,46,0.55)] transition duration-300 hover:scale-105 sm:bottom-7 sm:right-7"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
