"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Animates the `.split-word` spans inside the returned ref's element from
 * their CSS-set hidden state (translateY(115%), see globals.css) up into
 * place. `scrollTrigger: true` fires it when the element scrolls into view
 * instead of immediately on mount (use for below-the-fold headlines).
 *
 * Animates plain pixel `y`, not gsap's `yPercent` — yPercent measured and
 * re-measured fine internally (confirmed via gsap.getProperty during
 * debugging) but left a second, never-animated translate() baked into the
 * element's actual transform, so the tween finished at yPercent 0 while the
 * text stayed visually pinned at its hidden offset. Measuring each target's
 * own height once and tweening `y` in px sidesteps that composite-transform
 * path entirely.
 */
export function useKineticReveal<T extends HTMLElement>(opts?: {
  scrollTrigger?: boolean;
  delay?: number;
}) {
  const ref = useRef<T | null>(null);
  const scrollTrigger = opts?.scrollTrigger ?? false;
  const delay = opts?.delay ?? 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>(".split-word");
    if (targets.length === 0) return;

    if (prefersReducedMotion()) {
      targets.forEach((t) => (t.style.transform = "none"));
      return;
    }

    const { gsap } = ensureGsap();
    const startY = (_i: number, target: Element) => (target as HTMLElement).offsetHeight * 1.15;

    const tween = gsap.fromTo(
      targets,
      { y: startY },
      {
        y: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.035,
        delay,
        ...(scrollTrigger ? { scrollTrigger: { trigger: el, start: "top 82%", once: true } } : {}),
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [scrollTrigger, delay]);

  return ref;
}
