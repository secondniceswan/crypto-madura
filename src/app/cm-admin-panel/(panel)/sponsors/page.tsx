"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getStoragePath } from "@/lib/storage";
import { Trash2, Upload, Loader2, X, Edit, XCircle } from "lucide-react";
import Image from "next/image";

interface SponsorPartner {
  id: string;
  type: string; // "sponsor" or "partner"
  name: string;
  image_url: string;
  created_at: string;
}

export default function AdminSponsorsPage() {
  const [items, setItems] = useState<SponsorPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [type, setType] = useState("sponsor");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState("");
  
  // Edit State
  const [editItem, setEditItem] = useState<SponsorPartner | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function loadItems() {
    const { data } = await supabase
      .from("sponsors_partners")
      .select("*")
      .order("created_at", { ascending: false });

    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function removeFile() {
    setFile(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleEditClick(item: SponsorPartner) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditItem(item);
    setName(item.name);
    setType(item.type);
    setPreview(item.image_url);
    setFile(null);
    setError("");
  }

  function handleCancelEdit() {
    setEditItem(null);
    setName("");
    setType("sponsor");
    setFile(null);
    setPreview("");
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || (!editItem && !file)) return;
    setSubmitting(true);
    setError("");

    let imageUrl = editItem?.image_url;

    // Upload new photo if exists
    if (file) {
      const ext = file.name.split(".").pop();
      const fileName = `sponsors/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(fileName, file);

      if (uploadError) {
        setError("Gagal upload foto: " + uploadError.message);
        setSubmitting(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;

      // Delete old photo if it was replaced during edit
      if (editItem && editItem.image_url) {
        const oldPath = getStoragePath(editItem.image_url, "media");
        if (oldPath) {
          await supabase.storage.from("media").remove([oldPath]);
        }
      }
    }

    if (editItem) {
      // Update
      const { error: updateError } = await supabase
        .from("sponsors_partners")
        .update({ name, type, image_url: imageUrl })
        .eq("id", editItem.id);

      if (updateError) {
        setError("Gagal update data: " + updateError.message);
        setSubmitting(false);
        return;
      }
    } else {
      // Create
      const { error: insertError } = await supabase
        .from("sponsors_partners")
        .insert({ name, type, image_url: imageUrl });

      if (insertError) {
        setError("Gagal menyimpan data: " + insertError.message);
        setSubmitting(false);
        return;
      }
    }

    handleCancelEdit();
    await loadItems();
    setSubmitting(false);
  }

  async function handleDelete(item: SponsorPartner) {
    if (!confirm(`Hapus ${item.type === 'sponsor' ? 'Sponsor' : 'Partner'} "${item.name}"?`)) return;

    if (item.image_url) {
      const path = getStoragePath(item.image_url, "media");
      if (path) {
        await supabase.storage.from("media").remove([path]);
      }
    }

    await supabase.from("sponsors_partners").delete().eq("id", item.id);
    setItems((prev) => prev.filter((n) => n.id !== item.id));
    if (editItem?.id === item.id) handleCancelEdit();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Sponsors & Partners</h1>
      <p className="text-sm text-text-secondary mb-8">
        Kelola logo entitas yang akan tampil di animasi berjalan (marquee).
      </p>

      {/* Form */}
      <div className={`glass-card p-6 mb-8 border-2 transition-colors ${editItem ? 'border-accent-blue/50 bg-accent-blue/5' : 'border-transparent'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">
            {editItem ? "Edit Data" : "Tambah Baru"}
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
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Tipe *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary text-sm focus:outline-none focus:border-accent-blue transition-colors"
            >
              <option value="sponsor">Sponsor</option>
              <option value="partner">Partner</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Nama *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary text-sm focus:outline-none focus:border-accent-blue transition-colors"
              placeholder="Contoh: Binance, Indodax, dll"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Logo * (Gunakan image dengan background transparan/putih)
            </label>

            {preview ? (
              <div className="relative w-40 h-24 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center p-2 group ring-1 ring-glass-border">
                <Image src={preview} alt="Preview" fill className="object-contain p-2" />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-accent-red/90 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {file && <span className="absolute bottom-1 right-1 text-[10px] bg-accent-blue px-1.5 py-0.5 rounded text-white font-bold">Baru</span>}
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                className="w-full sm:w-64 border-2 border-dashed border-glass-border rounded-xl p-6 text-center cursor-pointer hover:border-accent-blue/50 transition-colors"
              >
                <Upload className="w-6 h-6 mx-auto mb-2 text-text-muted" />
                <p className="text-sm text-text-muted">Pilih logo</p>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {error && <p className="text-sm text-accent-red font-semibold">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting || !name || (!editItem && !file)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-semibold hover:bg-accent-blue/90 transition-colors disabled:opacity-60 min-h-[44px]"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Menyimpan..." : (editItem ? "Simpan Perubahan" : "Tambah Data")}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <h2 className="text-base font-semibold mb-4">
        Daftar Entities ({items.length})
      </h2>

      {loading ? (
        <div className="flex items-center gap-2 text-text-muted text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Memuat...
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card p-8 text-center text-text-muted text-sm">
          Belum ada data.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="glass-card p-4 flex flex-col gap-3">
              <div className="relative w-full h-20 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
                <Image src={item.image_url} alt={item.name} fill className="object-contain p-2" />
              </div>
              <div className="flex-1 text-center">
                <p className="text-sm font-semibold truncate" title={item.name}>{item.name}</p>
                <p className={`text-xs mt-1 px-2 py-0.5 rounded inline-block ${item.type === 'sponsor' ? 'bg-accent-blue/20 text-accent-blue' : 'bg-purple-500/20 text-purple-400'}`}>
                  {item.type.toUpperCase()}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => handleEditClick(item)}
                  className="flex-1 flex items-center justify-center gap-1 text-xs bg-glass-panel hover:bg-white/10 px-2 py-1.5 rounded-lg transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="flex-1 flex items-center justify-center gap-1 text-xs text-accent-red hover:bg-accent-red/10 px-2 py-1.5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
