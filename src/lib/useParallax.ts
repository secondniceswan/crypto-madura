"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Ties an element's vertical position to scroll progress through its own
 * viewport pass — a subtle depth cue, not a big parallax jump. `speed` is
 * the total travel in px from when the element enters to when it leaves
 * the viewport (positive = drifts down as you scroll past it).
 */
export function useParallax<T extends HTMLElement>(speed: number = 60) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const { gsap } = ensureGsap();
    const tween = gsap.fromTo(
      el,
      { y: -speed / 2 },
      {
        y: speed / 2,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed]);

  return ref;
}
