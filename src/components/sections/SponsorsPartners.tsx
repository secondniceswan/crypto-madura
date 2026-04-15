import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function SponsorsPartners() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sponsors_partners")
    .select("*")
    .order("created_at", { ascending: true });

  const sponsors = (data || []).filter(item => item.type === "sponsor");
  const partners = (data || []).filter(item => item.type === "partner");

  if (sponsors.length === 0 && partners.length === 0) return null;

  // The animation duration base relies on number of items, e.g., 3 seconds per item
  const sponsorSpeed = Math.max(20, sponsors.length * 4);
  const partnerSpeed = Math.max(20, partners.length * 4);

  // Use 4 copies to ensure it fills large monitors and loops perfectly at -50%
  const sponsorsArray = [...sponsors, ...sponsors, ...sponsors, ...sponsors];
  const partnersArray = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className="border-y border-glass-border bg-bg-secondary w-full relative overflow-hidden flex flex-col py-16">
      <div className="absolute inset-y-0 left-0 w-16 md:w-40 bg-gradient-to-r from-bg-secondary to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-16 md:w-40 bg-gradient-to-l from-bg-secondary to-transparent z-10 pointer-events-none"></div>
      
      <div className="w-full">
        {sponsors.length > 0 && (
          <div className="mb-12">
            <p className="text-center text-xs md:text-sm font-bold tracking-widest text-text-muted mb-8 uppercase">Sponsored By</p>
            <div className="flex w-full overflow-hidden">
              <div 
                className="flex animate-scroll-logos items-center gap-12 md:gap-24 pr-12 md:pr-24 w-max"
                style={{ animationDuration: `${sponsorSpeed}s` }}
              >
                {sponsorsArray.map((item, i) => (
                  <div key={`s-${item.id}-${i}`} className="relative h-16 w-40 md:h-24 md:w-60 shrink-0 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                     <Image src={item.image_url} alt={item.name} fill className="object-contain" title={item.name} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {partners.length > 0 && (
          <div className="mt-12">
            <p className="text-center text-xs md:text-sm font-bold tracking-widest text-text-muted mb-8 uppercase">Our Partners</p>
            <div className="flex w-full overflow-hidden">
              <div 
                className="flex animate-scroll-logos-reverse items-center gap-12 md:gap-24 pl-12 md:pl-24 w-max"
                style={{ animationDuration: `${partnerSpeed}s` }}
              >
                {partnersArray.map((item, i) => (
                  <div key={`p-${item.id}-${i}`} className="relative h-14 w-36 md:h-20 md:w-52 shrink-0 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-50 hover:opacity-100">
                     <Image src={item.image_url} alt={item.name} fill className="object-contain" title={item.name} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
