import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { onReady } from "../lib/ready";
import {
  LEAF_LEFT, LEAF_RIGHT, LEAF_CENTER, LEAF_INNER, DOT_BIG, DOT_SMALL,
} from "./logoPaths";

/**
 * The Natusz symbol, large, "blooming" open when the page loads.
 * The leaves unfold and the two red dots rise like drops.
 */
export default function BloomMark({ className = "" }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      gsap.set(".bm-leaf-left", { opacity: 0, rotation: 42, scale: 0.35, svgOrigin: "285 412" });
      gsap.set(".bm-leaf-right", { opacity: 0, rotation: -42, scale: 0.35, svgOrigin: "309 412" });
      gsap.set(".bm-leaf-center", { opacity: 0, scaleY: 0.1, scaleX: 0.6, svgOrigin: "302 410" });
      gsap.set(".bm-leaf-inner", { opacity: 0, scale: 0.1, svgOrigin: "280 368" });
      gsap.set(".bm-dot", { opacity: 0, y: 70, scale: 0.3, transformOrigin: "50% 50%" });

      let float;
      const stopWaiting = onReady(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(".bm-leaf-center", { opacity: 1, scaleY: 1, scaleX: 1, duration: 1.3 }, 0)
          .to(".bm-leaf-left", { opacity: 1, rotation: 0, scale: 1, duration: 1.5 }, 0.15)
          .to(".bm-leaf-right", { opacity: 1, rotation: 0, scale: 1, duration: 1.5 }, 0.15)
          .to(".bm-leaf-inner", { opacity: 1, scale: 1, duration: 1.1 }, 0.55)
          .to(".bm-dot", { opacity: 1, y: 0, scale: 1, duration: 1.4, stagger: 0.18, ease: "back.out(1.8)" }, 0.8);
        tl.add(() => {
          // gentle, endless float once open
          float = gsap.to(".bm-dot", {
            y: -7, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.4,
          });
        });
      });
      return () => {
        stopWaiting();
        float && float.kill();
      };
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="198 270 200 150"
      className={className}
      role="img"
      aria-label="Natusz symbol"
    >
      <path className="bm-leaf-right" d={LEAF_RIGHT} fill="#059EA9" />
      <path className="bm-leaf-left" d={LEAF_LEFT} fill="#059EA9" />
      <path className="bm-leaf-center" d={LEAF_CENTER} fill="#059EA9" />
      <path className="bm-leaf-inner" d={LEAF_INNER} fill="#059EA9" />
      <path className="bm-dot" d={DOT_BIG} fill="#ED1C24" />
      <path className="bm-dot" d={DOT_SMALL} fill="#ED1C24" />
    </svg>
  );
}
