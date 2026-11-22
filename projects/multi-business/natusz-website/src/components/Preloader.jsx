import { useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { isReady, markReady } from "../lib/ready";
import Logo from "./Logo";

/** Short opening curtain, shown once per browser session. */
export default function Preloader() {
  const [done, setDone] = useState(isReady());
  const root = useRef(null);

  useLayoutEffect(() => {
    if (done) return;
    if (prefersReducedMotion()) {
      markReady();
      setDone(true);
      return;
    }
    document.body.style.overflow = "hidden";
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          markReady();
          setDone(true);
        },
      });
      tl.fromTo(".pl-logo", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .fromTo(".pl-bar", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, 0.1)
        .to(".pl-logo, .pl-bar", { opacity: 0, duration: 0.35, ease: "power2.in" }, "+=0.15")
        .to(root.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" });
    }, root);
    return () => {
      document.body.style.overflow = "";
      ctx.revert();
    };
  }, [done]);

  if (done) return null;
  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-ink"
      aria-hidden="true"
    >
      <Logo layout="stacked" tone="light" className="pl-logo h-40 w-auto sm:h-52" />
      <div className="h-px w-40 overflow-hidden bg-white/10">
        <div className="pl-bar h-full origin-left bg-brand" />
      </div>
    </div>
  );
}
