import { GraduationCap, BarChart3, Video, Users } from "lucide-react";
import type { Service } from "@/types";
import Card from "./Card";

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  BarChart3,
  Video,
  Users,
};

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = iconMap[service.icon] || Users;

  return (
    <Card hover>
      <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-accent-blue" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">
        {service.description}
      </p>
    </Card>
  );
}
