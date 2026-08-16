import { Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function Contact() {
  return (
    <section id="contact" className="py-16 sm:py-20 bg-charcoal">
      <div className="container-px">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Bring Your Firearm In"
          description="Reach out for a quote, a service booking, or just to ask a question — we reply personally, every time."
        />

        <RevealOnScroll direction="up" className="mx-auto max-w-xl">
          <div className="card-surface p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={siteConfig.contact.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-brass/60 bg-brass/10 px-5 py-3 text-sm font-medium text-ivory transition-colors hover:bg-brass hover:text-charcoal"
              >
                <Phone size={18} />
                Call Now
              </a>

              <a
                href={siteConfig.contact.whatsappHref(
                  "Hello, I would like to enquire about a service.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-brass/60 bg-transparent px-5 py-3 text-sm font-medium text-ivory transition-colors hover:border-brass hover:bg-brass/10"
              >
                <MessageCircle size={18} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
