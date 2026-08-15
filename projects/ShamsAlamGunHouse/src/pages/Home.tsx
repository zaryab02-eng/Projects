import { Hero } from "@/components/sections/Hero";
import { LegacyTimeline } from "@/components/sections/LegacyTimeline";
import { AboutUs } from "@/components/sections/AboutUs";
import { Services } from "@/components/sections/Services";
import { Reviews } from "@/components/sections/Reviews";
import { BusinessHighlights } from "@/components/sections/BusinessHighlights";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Contact } from "@/components/sections/Contact";

/**
 * The homepage keeps the core brand story and trust-building sections.
 * The larger visual galleries and restoration archives live on dedicated
 * pages so the main landing experience stays focused and uncluttered.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <LegacyTimeline />
      <AboutUs />
      <Services />
      <Reviews />
      <BusinessHighlights />
      <WhyChooseUs />
      <Contact />
    </>
  );
}
