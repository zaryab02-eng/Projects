import { useState, useMemo } from 'react'
import { restorationProjects, restorationCategories } from '@/data/restorations'
import type { RestorationCategory } from '@/types'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { BeforeAfterSlider } from '@/components/shared/BeforeAfterSlider'

export function BeforeAfterGallery() {
  const [activeCategory, setActiveCategory] = useState<RestorationCategory>('All')

  const filtered = useMemo(
    () =>
      activeCategory === 'All'
        ? restorationProjects
        : restorationProjects.filter((p) => p.category === activeCategory),
    [activeCategory],
  )

  return (
    <section id="restorations" className="py-28 sm:py-36 bg-charcoal">
      <div className="container-px">
        <SectionHeading
          eyebrow="Restoration Highlights"
          title="Before & After"
          description="Drag the slider on any project to see the transformation for yourself."
        />

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {restorationCategories.map((category) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filtered.map((project, i) => (
            <RevealOnScroll key={project.id} delay={(i % 2) * 0.1}>
              <div className="card-surface p-4 sm:p-5">
                <BeforeAfterSlider
                  beforeImage={project.beforeImage}
                  afterImage={project.afterImage}
                  altText={project.title}
                />
                <div className="pt-6 px-1">
                  <span className="font-mono text-[11px] uppercase tracking-widest2 text-brass">
                    {project.category}
                  </span>
                  <h3 className="font-display text-xl text-ivory mt-2 mb-2">{project.title}</h3>
                  <p className="text-sm text-ash mb-4">{project.description}</p>
                  <ul className="flex flex-wrap gap-2">
                    {project.workPerformed.map((item) => (
                      <li
                        key={item}
                        className="text-[11px] font-mono uppercase tracking-wide text-ash border border-white/10 rounded-sm px-2.5 py-1"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
