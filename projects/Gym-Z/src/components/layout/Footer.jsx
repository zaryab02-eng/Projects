// Rendered on every page, per the spec: "Made by Zaryab" at the bottom.
export default function Footer() {
  return (
    <footer className="py-6 text-center text-xs text-ink-500 border-t border-ink-800 mt-auto">
      <p>© {new Date().getFullYear()} Gym-Z · Made by <span className="text-copper-400 font-semibold">Zaryab</span></p>
    </footer>
  )
}
