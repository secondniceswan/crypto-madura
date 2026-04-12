import SectionHeader from "@/components/ui/SectionHeader";
import FounderCard from "@/components/ui/FounderCard";
import { createClient } from "@/lib/supabase/server";
import type { Founder } from "@/types";

export default async function Founders() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("founders")
    .select("*")
    .order("order_index", { ascending: true });

  const founders: Founder[] = (data ?? []).map((f) => ({
    id: f.id,
    name: f.name,
    role: f.role,
    bio: f.bio ?? "",
    quote: f.quote ?? "",
    image: f.image_url ?? "",
    instagram: f.instagram ?? undefined,
  }));

  return (
    <section id="founder" className="section-container bg-bg-secondary/30">
      <SectionHeader
        title="Tim Kami"
        subtitle="Orang-orang di balik Crypto Madura"
      />
      {founders.length === 0 ? (
        <div className="glass-card p-12 text-center max-w-md mx-auto">
          <p className="text-2xl font-bold text-text-muted mb-2">Coming Soon</p>
          <p className="text-sm text-text-muted">
            Profil tim akan segera hadir.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {founders.map((founder) => (
            <FounderCard key={founder.name} founder={founder} />
          ))}
        </div>
      )}
    </section>
  );
}
