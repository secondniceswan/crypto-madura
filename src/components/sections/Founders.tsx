import { Users } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import FounderCard from "@/components/ui/FounderCard";
import Reveal from "@/components/ui/Reveal";
import { createClient } from "@/lib/supabase/server";
import type { Founder } from "@/types";

export default async function Founders() {
  const supabase = await createClient();

  let founders: Founder[] = [];
  if (supabase) {
    try {
      const { data } = await supabase
        .from("founders")
        .select("*")
        .order("order_index", { ascending: true });

      founders = (data ?? []).map((f) => ({
        id: f.id,
        name: f.name,
        role: f.role,
        bio: f.bio ?? "",
        quote: f.quote ?? "",
        image: f.image_url ?? "",
        instagram: f.instagram ?? undefined,
      }));
    } catch {
      founders = [];
    }
  }

  return (
    <section id="founder" className="relative section-container bg-bg-secondary/30 border-y border-glass-border">
      <SectionHeader
        eyebrow="// Orang di baliknya"
        title="Tim Kami"
        subtitle="Orang-orang di balik Crypto Madura"
      />
      {founders.length === 0 ? (
        <Reveal className="glass-card card-glow p-12 sm:p-16 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-indigo/20 to-accent-blue/10 border border-accent-indigo/20 flex items-center justify-center mx-auto mb-5">
            <Users className="w-7 h-7 text-accent-indigo" />
          </div>
          <p className="text-2xl font-bold gradient-text mb-2">Coming Soon</p>
          <p className="text-sm text-text-muted">Profil tim akan segera hadir.</p>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {founders.map((founder, i) => (
            <Reveal key={founder.id ?? founder.name} delay={i * 100}>
              <FounderCard founder={founder} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
