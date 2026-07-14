import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps {
  variant?: 'primary' | 'ghost'
  children: ReactNode
  className?: string
}

/**
 * Solid, brass-gradient call-to-action button. Use for the single most
 * important action in a section (e.g. "Book a Service").
 */
export function Button({
  variant = 'primary',
  children,
  className = '',
  ...rest
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-ghost'
  return (
    <button className={`${base} ${className}`.trim()} {...rest}>
      {children}
    </button>
  )
}

/**
 * Anchor-tag counterpart of Button, styled identically. Use for links
 * that navigate away (WhatsApp, tel:, mailto:) rather than trigger
 * in-page behaviour.
 */
export function LinkButton({
  variant = 'primary',
  children,
  className = '',
  ...rest
}: ButtonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-ghost'
  return (
    <a className={`${base} ${className}`.trim()} {...rest}>
      {children}
    </a>
  )
}
