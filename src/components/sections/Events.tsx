import SectionHeader from "@/components/ui/SectionHeader";
import EventsGrid from "@/components/ui/EventsGrid";
import { createClient } from "@/lib/supabase/server";

export default async function Events() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*, event_photos(id, image_url, order_index)")
    .order("created_at", { ascending: false });

  const events = (data ?? []).map((e) => ({
    ...e,
    event_photos: (e.event_photos ?? []).sort(
      (a: { order_index: number }, b: { order_index: number }) =>
        a.order_index - b.order_index
    ),
  }));

  return (
    <section id="events" className="section-container">
      <SectionHeader
        title="Dokumentasi Event"
        subtitle="Momen-momen seru dari kegiatan komunitas kami"
      />

      {events.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-2xl font-bold text-text-muted mb-2">Coming Soon</p>
          <p className="text-sm text-text-muted">
            Dokumentasi event akan segera hadir. Stay tuned!
          </p>
        </div>
      ) : (
        <EventsGrid events={events} />
      )}
    </section>
  );
}
