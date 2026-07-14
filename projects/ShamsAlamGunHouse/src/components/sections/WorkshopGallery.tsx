import { useMemo, useState } from 'react'
import { galleryImages, galleryCategories } from '@/data/gallery'
import type { GalleryCategory } from '@/types'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

export function WorkshopGallery() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'All'>('All')

  const filtered = useMemo(
    () => (activeCategory === 'All' ? galleryImages : galleryImages.filter((img) => img.category === activeCategory)),
    [activeCategory],
  )

  return (
    <section id="gallery" className="py-28 sm:py-36 bg-iron">
      <div className="container-px">
        <SectionHeading
          eyebrow="Inside the Workshop"
          title="Where the Work Happens"
          description="Tools, process, and finished pieces — an honest look at the bench behind every restoration."
        />

        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {(['All', ...galleryCategories] as const).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`font-mono text-xs uppercase tracking-widest2 px-5 py-2.5 rounded-sm border transition-colors ${
                activeCategory === category
                  ? 'border-brass bg-brass/10 text-brass-light'
                  : 'border-white/10 text-ash hover:border-brass/40 hover:text-ivory'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry-style layout using CSS columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {filtered.map((img, i) => (
            <RevealOnScroll key={img.id} delay={(i % 6) * 0.06} className="mb-5 break-inside-avoid">
              <div className="group relative overflow-hidden rounded-sm border border-white/5">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-iron/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                  <p className="text-xs font-mono uppercase tracking-widest2 text-brass-light">{img.category}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
