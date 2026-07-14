import { Hero } from '@/components/sections/Hero'
import { LegacyTimeline } from '@/components/sections/LegacyTimeline'
import { AboutUs } from '@/components/sections/AboutUs'
import { Services } from '@/components/sections/Services'
import { BeforeAfterGallery } from '@/components/sections/BeforeAfterGallery'
import { WorkshopGallery } from '@/components/sections/WorkshopGallery'
import { AccessoriesShop } from '@/components/sections/AccessoriesShop'
import { Reviews } from '@/components/sections/Reviews'
import { BusinessHighlights } from '@/components/sections/BusinessHighlights'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { Contact } from '@/components/sections/Contact'

/**
 * The single-page home route. Sections are composed in the order they
 * should scroll. To reorder the page, reorder these lines — each
 * section is self-contained and reads its own data.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <LegacyTimeline />
      <AboutUs />
      <Services />
      <BeforeAfterGallery />
      <WorkshopGallery />
      <AccessoriesShop />
      <Reviews />
      <BusinessHighlights />
      <WhyChooseUs />
      <Contact />
    </>
  )
}
