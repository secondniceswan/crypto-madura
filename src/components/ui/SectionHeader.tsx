import Reveal from "@/components/ui/Reveal";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  centered?: boolean;
}

export default function SectionHeader({
  title,
  subtitle,
  eyebrow,
  centered = true,
}: SectionHeaderProps) {
  return (
    <Reveal className={`mb-14 ${centered ? "text-center" : ""}`}>
      {eyebrow && (
        <span className={`eyebrow mb-4 ${centered ? "justify-center" : ""}`}>
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mt-3">
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      {centered && (
        <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-accent-blue/60 to-transparent" />
      )}
    </Reveal>
  );
}
