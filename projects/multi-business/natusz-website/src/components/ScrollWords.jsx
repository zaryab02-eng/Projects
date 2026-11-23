import { useRef } from "react";
import { useIsoLayoutEffect } from "../lib/useIsoLayoutEffect";
import { gsap, prefersReducedMotion } from "../lib/gsap";

/** Big statement whose words light up one by one as you scroll past it. */
export default function ScrollWords({ text, className = "" }) {
  const ref = useRef(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sw-word",
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 78%",
            end: "bottom 50%",
            scrub: true,
          },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="sw-word inline-block">
          {w}&nbsp;
        </span>
      ))}
    </p>
  );
}
