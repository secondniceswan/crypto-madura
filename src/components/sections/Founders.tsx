import SectionHeader from "@/components/ui/SectionHeader";
import FounderCard from "@/components/ui/FounderCard";
import { founders } from "@/lib/data";

export default function Founders() {
  return (
    <section id="founder" className="section-container bg-bg-secondary/30">
      <SectionHeader
        title="Tim Kami"
        subtitle="Orang-orang di balik Crypto Madura"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {founders.map((founder) => (
          <FounderCard key={founder.name} founder={founder} />
        ))}
      </div>
    </section>
  );
}
