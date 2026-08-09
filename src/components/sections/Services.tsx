import SectionHeader from "@/components/ui/SectionHeader";
import ServiceCard from "@/components/ui/ServiceCard";
import Reveal from "@/components/ui/Reveal";
import { services } from "@/lib/data";

export default function Services() {
  return (
    <section id="layanan" className="section-container">
      <SectionHeader
        eyebrow="// Apa yang kami tawarkan"
        title="Layanan Kami"
        subtitle="Berbagai layanan untuk membantu perjalanan crypto Anda"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, i) => (
          <Reveal key={service.title} delay={i * 90} variant="kinetic">
            <ServiceCard service={service} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
