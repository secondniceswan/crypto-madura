/**
 * Splits a headline into per-word masked spans for a kinetic reveal (each
 * word slides up out of an overflow-hidden mask). Structural only — the
 * actual animation is driven by whichever parent GSAP-tweens `.split-word`;
 * see useKineticReveal. The hidden base state lives in globals.css
 * (.split-word) so there's no flash of fully-visible text before JS runs.
 *
 * `words` takes nodes rather than a plain string so a styled fragment (e.g.
 * a <span className="gradient-text"> word) can sit inline with plain text
 * and still get the same per-word reveal treatment.
 */
export default function SplitWords({
  words,
  className = "",
}: {
  words: React.ReactNode[];
  className?: string;
}) {
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden pb-[0.15em] -mb-[0.15em] align-bottom">
            <span className="split-word inline-block">{word}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/** Convenience: turn a plain string into the `words` array SplitWords expects. */
export function splitPlain(text: string): string[] {
  return text.split(" ");
}
