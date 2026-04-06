import SectionHeader from "@/components/ui/SectionHeader";
import { eventPhotos } from "@/lib/data";

export default function Events() {
  return (
    <section id="events" className="section-container">
      <SectionHeader
        title="Dokumentasi Event"
        subtitle="Momen-momen seru dari kegiatan komunitas kami"
      />

      {eventPhotos.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-2xl font-bold text-text-muted mb-2">Coming Soon</p>
          <p className="text-sm text-text-muted">
            Dokumentasi event akan segera hadir. Stay tuned!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {eventPhotos.map((photo, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-xl overflow-hidden bg-bg-tertiary group"
            >
              <div className="w-full h-full bg-gradient-to-br from-accent-blue/10 to-accent-cyan/10 flex items-center justify-center">
                <span className="text-xs text-text-muted text-center px-2">
                  {photo.alt}
                </span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                <p className="text-xs text-white p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {photo.alt}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
