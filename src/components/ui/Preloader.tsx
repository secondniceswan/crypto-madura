"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ensureGsap, prefersReducedMotion } from "@/lib/motion";

const SESSION_KEY = "cm_intro_played";

/**
 * A brief branded curtain that plays once per browser session (gated by
 * sessionStorage, not shown again on internal navigation or a repeat visit
 * in the same tab) — unlike a "click to enter" gate, it never blocks
 * interaction; it just covers the first ~1.5s of paint with a wordmark +
 * progress line, then wipes away on its own.
 *
 * Renders nothing during SSR and on the very first client render (avoids a
 * hydration mismatch from reading sessionStorage) — see the `mounted` gate.
 */
export default function Preloader() {
  // Starts false for both the server render and the first client render (same
  // value either way, so no hydration mismatch) and only ever flips true from
  // inside an effect — i.e. strictly after hydration — which is what actually
  // makes reading sessionStorage here safe, no separate "mounted" flag needed.
  const [show, setShow] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const markRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      return; // sessionStorage unavailable (e.g. some private-browsing modes) — skip, never block the page
    }
    // One-time read of a browser-only flag on mount, deliberately not derived
    // during render (that's exactly what would cause the SSR/client mismatch
    // this component exists to avoid).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}

    const { gsap } = ensureGsap();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        document.body.style.overflow = previousOverflow;
        setShow(false);
      },
    });

    tl.fromTo(markRef.current, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5 })
      .fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.65, transformOrigin: "left center" },
        "-=0.15"
      )
      .to(markRef.current, { opacity: 0, scale: 1.05, duration: 0.3 }, "+=0.15")
      .to(overlayRef.current, { yPercent: -100, duration: 0.7, ease: "power4.inOut" }, "-=0.05");

    return () => {
      tl.kill();
      document.body.style.overflow = previousOverflow;
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-primary"
    >
      <div ref={markRef} className="flex flex-col items-center gap-4">
        <Image src="/images/logo.png" alt="" width={56} height={56} priority />
        <span className="font-mono text-xs tracking-[0.3em] text-text-muted uppercase">
          Crypto Madura
        </span>
      </div>
      <div className="mt-8 h-px w-40 overflow-hidden bg-white/10">
        <div
          ref={barRef}
          className="h-full w-full origin-left bg-gradient-to-r from-accent-blue to-accent-cyan"
        />
      </div>
    </div>
  );
}
