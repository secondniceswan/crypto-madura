interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`glass-card p-6 ${
        hover
          ? "transition-all duration-300 hover:-translate-y-1 hover:border-accent-blue/30 hover:shadow-[var(--shadow-glow-blue)]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
