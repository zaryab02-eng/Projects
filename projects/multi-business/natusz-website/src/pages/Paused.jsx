import { site } from "../config/site";

/**
 * Shown instead of the whole website when the host variable VITE_SITE_PAUSED is set to "true".
 * Nothing about the reason is shown. To resume, remove the variable (or set it to false) and redeploy.
 */
export default function Paused() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center text-paper">
      <h1 className="font-display text-4xl sm:text-5xl">{site.name}</h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-paper/70">
        This website is temporarily unavailable. Please check back soon.
      </p>
    </main>
  );
}
