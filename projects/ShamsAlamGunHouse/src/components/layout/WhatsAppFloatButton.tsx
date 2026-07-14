import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

/**
 * Persistent floating WhatsApp button, fixed to the bottom-right corner
 * on every page. Opens a chat pre-filled with a general enquiry message.
 */
export function WhatsAppFloatButton() {
  return (
    <a
      href={siteConfig.contact.whatsappHref(
        "Hello Sham's Alam Gun House, I'd like to enquire about a service.",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brass-gradient shadow-brass transition-transform hover:scale-105"
    >
      <MessageCircle className="text-iron" size={26} />
    </a>
  );
}
