"use client";

import { useState } from "react";
import Modal from "./Modal";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EventPhoto {
  id: string;
  image_url: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  created_at: string;
  event_photos: EventPhoto[];
}

export default function EventsGrid({ events }: { events: Event[] }) {
  const [selected, setSelected] = useState<Event | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  function openEvent(event: Event) {
    setSelected(event);
    setPhotoIndex(0);
  }

  function closeModal() {
    setSelected(null);
    setPhotoIndex(0);
  }

  function prevPhoto() {
    if (!selected) return;
    setPhotoIndex((i) =>
      i === 0 ? selected.event_photos.length - 1 : i - 1
    );
  }

  function nextPhoto() {
    if (!selected) return;
    setPhotoIndex((i) =>
      i === selected.event_photos.length - 1 ? 0 : i + 1
    );
  }

  const photos = selected?.event_photos ?? [];
  const currentPhoto = photos[photoIndex];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {events.map((event) => {
          const thumb = event.event_photos[0]?.image_url;
          return (
            <button
              key={event.id}
              onClick={() => openEvent(event)}
              className="relative aspect-square rounded-xl overflow-hidden bg-bg-tertiary group focus:outline-none focus:ring-2 focus:ring-accent-blue"
            >
              {thumb ? (
                <img
                  src={thumb}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent-blue/10 to-accent-cyan/10" />
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col items-start justify-end">
                <div className="p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
                  <p className="text-xs font-semibold text-white leading-tight truncate">
                    {event.title}
                  </p>
                  {event.event_photos.length > 1 && (
                    <p className="text-xs text-white/60 mt-0.5">
                      {event.event_photos.length} foto
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal */}
      <Modal open={!!selected} onClose={closeModal} maxWidth="max-w-3xl">
        {selected && (
          <div className="flex flex-col overflow-hidden">
            {/* Photo viewer */}
            <div className="relative bg-black flex items-center justify-center min-h-[240px] sm:min-h-[360px]">
              {currentPhoto && (
                <img
                  src={currentPhoto.image_url}
                  alt={selected.title}
                  className="w-full max-h-[60vh] object-contain"
                />
              )}

              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    aria-label="Foto sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    aria-label="Foto berikutnya"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  {/* Dot indicators */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {photos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPhotoIndex(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          i === photoIndex
                            ? "bg-white w-3"
                            : "bg-white/40"
                        }`}
                        aria-label={`Foto ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Info */}
            <div className="p-5 overflow-y-auto">
              <h3 className="text-lg font-bold mb-1">{selected.title}</h3>
              <p className="text-xs text-text-muted mb-3">
                {new Date(selected.created_at).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {photos.length > 1 && ` · ${photos.length} foto`}
              </p>
              {selected.description && (
                <p className="text-sm text-text-secondary leading-relaxed">
                  {selected.description}
                </p>
              )}

              {/* Thumbnail strip */}
              {photos.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                  {photos.map((photo, i) => (
                    <button
                      key={photo.id}
                      onClick={() => setPhotoIndex(i)}
                      className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                        i === photoIndex
                          ? "border-accent-blue"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={photo.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
