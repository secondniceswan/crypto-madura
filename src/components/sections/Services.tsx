import SectionHeader from "@/components/ui/SectionHeader";
import ServiceCard from "@/components/ui/ServiceCard";
import { services } from "@/lib/data";

export default function Services() {
  return (
    <section id="layanan" className="section-container">
      <SectionHeader
        title="Layanan Kami"
        subtitle="Berbagai layanan untuk membantu perjalanan crypto Anda"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.title} service={service} />
        ))}
      </div>
    </section>
  );
}
