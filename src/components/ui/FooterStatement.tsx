"use client";

import SplitWords from "./SplitWords";
import { useKineticReveal } from "@/lib/useKineticReveal";

/**
 * Purely decorative closing line for the footer's "curtain" panel — split
 * out as its own client component so Footer itself can stay a server
 * component (it awaits the social_links query) while still getting the
 * kinetic word-reveal treatment.
 */
export default function FooterStatement() {
  const ref = useKineticReveal<HTMLParagraphElement>({ scrollTrigger: true });

  return (
    <p
      ref={ref}
      className="text-center text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-12"
    >
      <SplitWords
        words={[
          "Terus",
          "belajar,",
          "terus",
          <span key="gradient" className="gradient-text">
            bareng
          </span>,
          "—",
          "sampai",
          "kapan",
          "pun.",
        ]}
      />
    </p>
  );
}
