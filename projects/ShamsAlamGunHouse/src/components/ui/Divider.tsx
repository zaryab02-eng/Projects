interface DividerProps {
  className?: string
}

/** Thin brass-to-transparent rule used to separate content without a hard line. */
export function Divider({ className = '' }: DividerProps) {
  return <div className={`h-px w-full bg-gradient-to-r from-transparent via-gunmetal to-transparent ${className}`} />
}
