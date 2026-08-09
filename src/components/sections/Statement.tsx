"use client";

import type { ReactNode } from "react";
import SplitWords from "@/components/ui/SplitWords";
import { useKineticReveal } from "@/lib/useKineticReveal";

function accent(word: string, key: string) {
  return (
    <span key={key} className="gradient-text">
      {word}
    </span>
  );
}

const WORDS: ReactNode[] = [
  "Dari",
  "nol",
  "sampai",
  "percaya",
  "diri.",
  "Kami",
  "bangun",
  accent("edukasi", "w1"),
  "yang",
  "jujur,",
  accent("sinyal", "w2"),
  "yang",
  "jelas,",
  "dan",
  accent("komunitas", "w3"),
  "yang",
  "saling",
  "jaga",
  "—",
  "supaya",
  "legacy",
  "crypto-mu",
  "tumbuh",
  "bareng",
  "Madura.",
];

/**
 * A full-statement, no-other-content section — the "kinetic typography"
 * beat borrowed from motion-graphics-led sites: one oversized headline is
 * the entire section, revealed word by word as it scrolls into view.
 * Rounded top only (no negative-margin overlap like the other curtained
 * sections) because Hero's coin ticker sits flush against the bottom edge
 * right above it — pulling this section up over it would clip the ticker.
 */
export default function Statement() {
  const ref = useKineticReveal<HTMLParagraphElement>({ scrollTrigger: true });

  return (
    <section className="relative rounded-t-[2.5rem] sm:rounded-t-[4rem] bg-bg-secondary py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-40" />
      <div className="relative mx-auto max-w-5xl px-6 sm:px-8">
        <p
          ref={ref}
          className="text-center text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.2]"
        >
          <SplitWords words={WORDS} />
        </p>
      </div>
    </section>
  );
}
