import { GraduationCap, BarChart3, Video, Users } from "lucide-react";
import type { Service } from "@/types";
import Card from "./Card";

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  BarChart3,
  Video,
  Users,
};

// Rotating accent per card keeps the grid lively while staying on-brand.
const accents = [
  { grad: "from-accent-blue/30 to-accent-blue/5", ring: "border-accent-blue/25", text: "text-accent-blue" },
  { grad: "from-accent-cyan/30 to-accent-cyan/5", ring: "border-accent-cyan/25", text: "text-accent-cyan" },
  { grad: "from-accent-indigo/30 to-accent-indigo/5", ring: "border-accent-indigo/25", text: "text-accent-indigo" },
  { grad: "from-accent-green/30 to-accent-green/5", ring: "border-accent-green/25", text: "text-accent-green" },
];

interface ServiceCardProps {
  service: Service;
  index?: number;
}

export default function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const Icon = iconMap[service.icon] || Users;
  const a = accents[index % accents.length];

  return (
    <Card hover className="group h-full flex flex-col">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.grad} border ${a.ring} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className={`w-6 h-6 ${a.text}`} />
      </div>
      {/* no hover arrow here — this card is not a link and must not look like one */}
      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">
        {service.description}
      </p>
    </Card>
  );
}
