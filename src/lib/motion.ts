import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * Registers the ScrollTrigger plugin exactly once. Must be called from a
 * client component (useEffect/useLayoutEffect) before any ScrollTrigger use —
 * importing gsap/ScrollTrigger at module scope is safe (no DOM access happens
 * until registerPlugin/create run), but calling registerPlugin during SSR
 * would be wasted work since the server render never scrolls.
 */
export function ensureGsap() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

/** Mirrors the `prefers-reduced-motion` check already backstopped in globals.css. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
