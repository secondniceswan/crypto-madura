import { CalendarClock } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import EventsGrid from "@/components/ui/EventsGrid";
import Reveal from "@/components/ui/Reveal";
import { createClient } from "@/lib/supabase/server";

type EventRow = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  event_photos: { id: string; image_url: string; order_index: number }[];
};

export default async function Events() {
  const supabase = await createClient();

  let events: EventRow[] = [];
  if (supabase) {
    try {
      const { data } = await supabase
        .from("events")
        .select("*, event_photos(id, image_url, order_index)")
        .order("created_at", { ascending: false });

      events = (data ?? []).map((e) => ({
        ...e,
        event_photos: (e.event_photos ?? []).sort(
          (a: { order_index: number }, b: { order_index: number }) =>
            a.order_index - b.order_index
        ),
      }));
    } catch {
      events = [];
    }
  }

  return (
    <section id="events" className="section-container">
      <SectionHeader
        eyebrow="// Galeri"
        title="Dokumentasi Event"
        subtitle="Momen-momen seru dari kegiatan komunitas kami"
      />

      {events.length === 0 ? (
        <Reveal className="glass-card card-glow p-12 sm:p-16 text-center max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-cyan/10 border border-accent-blue/20 flex items-center justify-center mx-auto mb-5">
            <CalendarClock className="w-7 h-7 text-accent-cyan" />
          </div>
          <p className="text-2xl font-bold gradient-text mb-2">Coming Soon</p>
          <p className="text-sm text-text-muted">
            Dokumentasi event akan segera hadir. Stay tuned!
          </p>
        </Reveal>
      ) : (
        <EventsGrid events={events} />
      )}
    </section>
  );
}
