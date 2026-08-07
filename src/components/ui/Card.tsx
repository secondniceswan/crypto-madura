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
          ? "card-glow hover:-translate-y-1.5 hover:shadow-[0_16px_50px_rgba(0,0,0,0.5)]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
