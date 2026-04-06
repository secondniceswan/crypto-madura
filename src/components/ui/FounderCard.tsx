import { Globe } from "lucide-react";
import type { Founder } from "@/types";
import Card from "./Card";

interface FounderCardProps {
  founder: Founder;
}

export default function FounderCard({ founder }: FounderCardProps) {
  return (
    <Card className="text-center">
      <div className="w-24 h-24 rounded-full bg-bg-tertiary mx-auto mb-4 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-accent-blue/30 to-accent-cyan/30 flex items-center justify-center text-2xl font-bold text-text-muted">
          {founder.name.charAt(0)}
        </div>
      </div>

      <h3 className="text-lg font-bold">{founder.name}</h3>
      <p className="text-sm text-accent-cyan mb-3">{founder.role}</p>
      <p className="text-sm text-text-secondary mb-4 leading-relaxed">
        {founder.bio}
      </p>

      <blockquote className="text-sm italic text-text-muted mb-4 border-l-2 border-accent-blue pl-3 text-left">
        &ldquo;{founder.quote}&rdquo;
      </blockquote>

      {founder.instagram && (
        <a
          href={founder.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent-blue transition-colors min-h-[44px]"
          aria-label={`Instagram ${founder.name}`}
        >
          <Globe className="w-4 h-4" />
          <span>Instagram</span>
        </a>
      )}
    </Card>
  );
}
