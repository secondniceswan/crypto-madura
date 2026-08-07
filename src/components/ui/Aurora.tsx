/**
 * Decorative, non-interactive aurora blobs + dotted grid.
 * Purely presentational; sits behind section content.
 */
export default function Aurora({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-accent-blue/20 blur-[100px] animate-aurora" />
      <div
        className="absolute top-1/3 -right-16 h-80 w-80 rounded-full bg-accent-cyan/15 blur-[110px] animate-aurora"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent-indigo/20 blur-[100px] animate-aurora"
        style={{ animationDelay: "-12s" }}
      />
    </div>
  );
}
