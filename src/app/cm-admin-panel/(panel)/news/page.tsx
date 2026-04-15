"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getStoragePath } from "@/lib/storage";
import { Trash2, Upload, Loader2, X, Edit, XCircle } from "lucide-react";
import Image from "next/image";

interface NewsPhoto {
  id: string;
  image_url: string;
  order_index: number;
}

interface NewsManual {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  news_photos: NewsPhoto[];
}

const CATEGORIES = ["Update", "Analisis", "Tutorial", "Market Update", "Edukasi", "Event"];

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsManual[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Update");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  
  // Edit State
  const [editItem, setEditItem] = useState<NewsManual | null>(null);
  const [existingPhotos, setExistingPhotos] = useState<NewsPhoto[]>([]);
  const [deletedPhotos, setDeletedPhotos] = useState<NewsPhoto[]>([]);

  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function loadNews() {
    const { data } = await supabase
      .from("news_manual")
      .select("*, news_photos(id, image_url, order_index)")
      .order("created_at", { ascending: false });

    setNews(
      (data ?? []).map((n) => ({
        ...n,
        news_photos: (n.news_photos ?? []).sort(
          (a: NewsPhoto, b: NewsPhoto) => a.order_index - b.order_index
        ),
      }))
    );
    setLoading(false);
  }

  useEffect(() => {
    loadNews();
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
  
  function removeExistingPhoto(photo: NewsPhoto) {
    setExistingPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    setDeletedPhotos((prev) => [...prev, photo]);
  }

  function handleEditClick(item: NewsManual) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditItem(item);
    setTitle(item.title);
    setExcerpt(item.excerpt || "");
    setCategory(item.category || "Update");
    setExistingPhotos(item.news_photos);
    setDeletedPhotos([]);
    setFiles([]);
    setPreviews([]);
    setError("");
  }

  function handleCancelEdit() {
    setEditItem(null);
    setTitle("");
    setExcerpt("");
    setCategory("Update");
    setExistingPhotos([]);
    setDeletedPhotos([]);
    setFiles([]);
    setPreviews([]);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;
    setSubmitting(true);
    setError("");

    let newsId = editItem?.id;

    if (editItem) {
      // Update Mode
      const { error: updateError } = await supabase
        .from("news_manual")
        .update({ title, excerpt, category })
        .eq("id", editItem.id);

      if (updateError) {
        setError("Gagal update berita: " + updateError.message);
        setSubmitting(false);
        return;
      }

      // Delete removed photos
      if (deletedPhotos.length > 0) {
        const paths = deletedPhotos
          .map((p) => getStoragePath(p.image_url, "media"))
          .filter((p): p is string => p !== null);
        
        if (paths.length > 0) {
          await supabase.storage.from("media").remove(paths);
        }
        await supabase
          .from("news_photos")
          .delete()
          .in("id", deletedPhotos.map((p) => p.id));
      }
    } else {
      // Create Mode
      const { data: newsData, error: newsError } = await supabase
        .from("news_manual")
        .insert({ title, excerpt, category })
        .select()
        .single();

      if (newsError || !newsData) {
        setError("Gagal membuat berita: " + newsError?.message);
        setSubmitting(false);
        return;
      }
      newsId = newsData.id;
    }

    // Upload new photos
    if (files.length > 0 && newsId) {
      const uploadResults: string[] = [];
      for (const file of files) {
        const ext = file.name.split(".").pop();
        const fileName = `news/${newsId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(fileName, file);
        if (uploadError) continue;
        const { data: urlData } = supabase.storage
          .from("media")
          .getPublicUrl(fileName);
        uploadResults.push(urlData.publicUrl);
      }

      if (uploadResults.length > 0) {
        const maxExistingIndex = editItem && existingPhotos.length > 0 
          ? Math.max(...existingPhotos.map(p => p.order_index)) 
          : -1;

        await supabase.from("news_photos").insert(
          uploadResults.map((url, i) => ({
            news_id: newsId,
            image_url: url,
            order_index: maxExistingIndex + 1 + i,
          }))
        );
      }
    }

    handleCancelEdit();
    await loadNews();
    setSubmitting(false);
  }

  async function handleDelete(item: NewsManual) {
    if (!confirm(`Hapus berita "${item.title}"?`)) return;

    const paths = item.news_photos
      .map((p) => getStoragePath(p.image_url, "media"))
      .filter((p): p is string => p !== null);
    if (paths.length > 0) {
      await supabase.storage.from("media").remove(paths);
    }

    await supabase.from("news_manual").delete().eq("id", item.id);
    setNews((prev) => prev.filter((n) => n.id !== item.id));
    if (editItem?.id === item.id) handleCancelEdit();
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary text-sm focus:outline-none focus:border-accent-blue transition-colors";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Berita Manual</h1>
      <p className="text-sm text-text-secondary mb-8">
        Kelola artikel berita manual — tampil di bawah berita otomatis dari API
      </p>

      <div className={`glass-card p-6 mb-8 border-2 transition-colors ${editItem ? 'border-accent-blue/50 bg-accent-blue/5' : 'border-transparent'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">
            {editItem ? "Edit Berita" : "Tambah Berita"}
          </h2>
          {editItem && (
            <button
              onClick={handleCancelEdit}
              className="text-xs flex items-center gap-1 text-text-secondary hover:text-white transition-colors"
            >
              <XCircle className="w-4 h-4" /> Batal Edit
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Judul *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="Judul artikel berita"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Deskripsi / Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Ringkasan singkat artikel..."
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Foto (opsional, bisa banyak sekaligus)
            </label>

            {(existingPhotos.length > 0 || previews.length > 0) && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                {/* Existing */}
                {existingPhotos.map((photo, i) => (
                  <div
                    key={`existing-${i}`}
                    className="relative aspect-square rounded-lg overflow-hidden bg-bg-tertiary group ring-1 ring-glass-border"
                  >
                    <Image src={photo.image_url} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(photo)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-accent-red/90 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {/* Previews */}
                {previews.map((src, i) => (
                  <div
                    key={`new-${i}`}
                    className="relative aspect-square rounded-lg overflow-hidden bg-bg-tertiary group ring-2 ring-accent-blue/50"
                  >
                    <Image src={src} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1 right-1 text-[10px] bg-accent-blue px-1.5 py-0.5 rounded text-white font-bold">Baru</span>
                  </div>
                ))}
                
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

            {existingPhotos.length === 0 && previews.length === 0 && (
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-glass-border rounded-xl p-8 text-center cursor-pointer hover:border-accent-blue/50 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-text-muted" />
                <p className="text-sm text-text-muted">Klik untuk pilih foto</p>
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

          {error && <p className="text-sm text-accent-red font-semibold">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || !title}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-semibold hover:bg-accent-blue/90 transition-colors disabled:opacity-60 min-h-[44px] flex-1 sm:flex-none"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting
                ? "Menyimpan..."
                : (editItem ? "Simpan Perubahan" : `Simpan Berita${files.length > 0 ? ` (${files.length} foto)` : ""}`)}
            </button>
            {editItem && (
               <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-glass-panel border border-glass-border text-white text-sm font-semibold hover:bg-white/10 transition-colors"
               >
                 Batal
               </button>
            )}
          </div>
        </form>
      </div>

      <h2 className="text-base font-semibold mb-4">
        Berita Tersimpan ({news.length})
      </h2>

      {loading ? (
        <div className="flex items-center gap-2 text-text-muted text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Memuat...
        </div>
      ) : news.length === 0 ? (
        <div className="glass-card p-8 text-center text-text-muted text-sm">
          Belum ada berita manual.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {news.map((item) => {
            const thumb = item.news_photos[0]?.image_url;
            return (
              <div key={item.id} className="glass-card p-4 flex gap-4 items-start">
                {thumb && (
                  <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-bg-tertiary flex-shrink-0">
                    <Image src={thumb} alt={item.title} fill className="object-cover" />
                    {item.news_photos.length > 1 && (
                      <span className="absolute bottom-0.5 right-0.5 text-xs bg-black/60 text-white px-1 rounded">
                        +{item.news_photos.length - 1}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-accent-blue/20 text-accent-blue">
                      {item.category}
                    </span>
                    <span className="text-xs text-text-muted">
                      {new Date(item.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <p className="text-sm font-semibold truncate">{item.title}</p>
                  {item.excerpt && (
                    <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                      {item.excerpt}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="flex-shrink-0 p-2 text-text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center bg-glass-panel"
                    aria-label="Edit berita"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="flex-shrink-0 p-2 text-accent-red hover:bg-accent-red/10 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center bg-glass-panel"
                    aria-label="Hapus berita"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
