"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getStoragePath } from "@/lib/storage";
import { Trash2, Upload, Loader2, X } from "lucide-react";
import Image from "next/image";

interface EventPhoto {
  id: string;
  image_url: string;
  order_index: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  created_at: string;
  event_photos: EventPhoto[];
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  async function loadEvents() {
    const { data } = await supabase
      .from("events")
      .select("*, event_photos(id, image_url, order_index)")
      .order("created_at", { ascending: false });

    setEvents(
      (data ?? []).map((e) => ({
        ...e,
        event_photos: (e.event_photos ?? []).sort(
          (a: EventPhoto, b: EventPhoto) => a.order_index - b.order_index
        ),
      }))
    );
    setLoading(false);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;
    setFiles((prev) => [...prev, ...selected]);
    setPreviews((prev) => [
      ...prev,
      ...selected.map((f) => URL.createObjectURL(f)),
    ]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || files.length === 0) return;
    setSubmitting(true);
    setError("");

    // Create event
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .insert({ title, description })
      .select()
      .single();

    if (eventError || !eventData) {
      setError("Gagal membuat event: " + eventError?.message);
      setSubmitting(false);
      return;
    }

    // Upload all photos
    const uploadResults: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const fileName = `events/${eventData.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(fileName, file);
      if (uploadError) continue;
      const { data: urlData } = supabase.storage
        .from("media")
        .getPublicUrl(fileName);
      uploadResults.push(urlData.publicUrl);
    }

    if (uploadResults.length === 0) {
      setError("Gagal upload semua foto.");
      // Rollback event
      await supabase.from("events").delete().eq("id", eventData.id);
      setSubmitting(false);
      return;
    }

    // Insert event_photos
    const { error: photosError } = await supabase.from("event_photos").insert(
      uploadResults.map((url, i) => ({
        event_id: eventData.id,
        image_url: url,
        order_index: i,
      }))
    );

    if (photosError) {
      setError("Event dibuat tapi gagal simpan foto: " + photosError.message);
    }

    setTitle("");
    setDescription("");
    setFiles([]);
    setPreviews([]);
    if (fileRef.current) fileRef.current.value = "";
    await loadEvents();
    setSubmitting(false);
  }

  async function handleDelete(event: Event) {
    if (!confirm(`Hapus event "${event.title}" beserta semua fotonya?`)) return;

    // Delete files from storage
    const paths = event.event_photos
      .map((p) => getStoragePath(p.image_url, "media"))
      .filter((p): p is string => p !== null);
    if (paths.length > 0) {
      await supabase.storage.from("media").remove(paths);
    }

    // Delete event (CASCADE deletes event_photos)
    await supabase.from("events").delete().eq("id", event.id);
    setEvents((prev) => prev.filter((e) => e.id !== event.id));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Events</h1>
      <p className="text-sm text-text-secondary mb-8">
        Kelola dokumentasi foto kegiatan komunitas
      </p>

      {/* Form */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-base font-semibold mb-4">Tambah Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Judul Event *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary text-sm focus:outline-none focus:border-accent-blue transition-colors"
              placeholder="Nama / judul event"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary text-sm focus:outline-none focus:border-accent-blue transition-colors resize-none"
              placeholder="Deskripsi singkat event..."
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Foto Event * (bisa pilih banyak sekaligus)
            </label>

            {/* Preview grid */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                {previews.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-lg overflow-hidden bg-bg-tertiary group"
                  >
                    <Image src={src} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {/* Add more button */}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-glass-border flex flex-col items-center justify-center text-text-muted hover:border-accent-blue/50 transition-colors"
                >
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-xs">Tambah</span>
                </button>
              </div>
            )}

            {previews.length === 0 && (
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-glass-border rounded-xl p-8 text-center cursor-pointer hover:border-accent-blue/50 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-text-muted" />
                <p className="text-sm text-text-muted">
                  Klik untuk pilih foto
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Bisa pilih banyak foto sekaligus
                </p>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {error && <p className="text-sm text-accent-red">{error}</p>}

          <button
            type="submit"
            disabled={submitting || files.length === 0 || !title}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-semibold hover:bg-accent-blue/90 transition-colors disabled:opacity-60 min-h-[44px]"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? "Menyimpan..." : `Simpan Event${files.length > 0 ? ` (${files.length} foto)` : ""}`}
          </button>
        </form>
      </div>

      {/* List */}
      <h2 className="text-base font-semibold mb-4">
        Event Tersimpan ({events.length})
      </h2>

      {loading ? (
        <div className="flex items-center gap-2 text-text-muted text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Memuat...
        </div>
      ) : events.length === 0 ? (
        <div className="glass-card p-8 text-center text-text-muted text-sm">
          Belum ada event.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const thumb = event.event_photos[0]?.image_url;
            return (
              <div key={event.id} className="glass-card p-4 flex flex-col gap-3">
                {thumb && (
                  <div className="relative w-full h-36 rounded-lg overflow-hidden bg-bg-tertiary">
                    <Image src={thumb} alt={event.title} fill className="object-cover" />
                    {event.event_photos.length > 1 && (
                      <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded-full">
                        {event.event_photos.length} foto
                      </span>
                    )}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold">{event.title}</p>
                  {event.description && (
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(event)}
                  className="flex items-center gap-2 text-xs text-accent-red hover:bg-accent-red/10 px-3 py-2 rounded-lg transition-colors min-h-[44px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus Event
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
