// Rendered on every page: "Made by Zaryab".
// withNav adds bottom space so the mobile tab bar never covers it.
export default function Footer({ withNav = false }) {
  return (
    <footer
      className={`pt-6 text-center text-xs text-ink-500 mt-auto ${withNav ? "pb-28 lg:pb-8" : "pb-8"}`}
    >
      <p>
        © {new Date().getFullYear()} Gym-Z · Made by{" "}
        <span className="text-copper-400 font-semibold">Zaryab</span>
      </p>
    </footer>
  );
}
