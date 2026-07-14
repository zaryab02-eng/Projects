import { RevealOnScroll } from './RevealOnScroll'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

/**
 * Standard section header used across every major section: a small
 * mono eyebrow label, a large serif title, and an optional description.
 * Keeping this in one component is what keeps section headers visually
 * consistent site-wide.
 */
export function SectionHeading({ eyebrow, title, description, align = 'center' }: SectionHeadingProps) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'

  return (
    <RevealOnScroll className={`flex flex-col ${alignment} max-w-2xl gap-4 mb-16`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-heading text-balance">{title}</h2>
      {description && <p className="body-copy text-base sm:text-lg">{description}</p>}
      <span className="rule mt-2" />
    </RevealOnScroll>
  )
}
