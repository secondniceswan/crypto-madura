"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getStoragePath } from "@/lib/storage";
import { Trash2, Upload, Loader2, Pencil, Check, X } from "lucide-react";
import Image from "next/image";

interface Founder {
  id: string;
  name: string;
  role: string;
  bio: string;
  quote: string;
  image_url: string;
  instagram: string;
  order_index: number;
}

const EMPTY: Omit<Founder, "id" | "order_index"> = {
  name: "",
  role: "",
  bio: "",
  quote: "",
  image_url: "",
  instagram: "",
};

export default function AdminTeamPage() {
  const [members, setMembers] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  async function loadMembers() {
    const { data } = await supabase
      .from("founders")
      .select("*")
      .order("order_index", { ascending: true });
    setMembers(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadMembers();
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function startEdit(member: Founder) {
    setEditId(member.id);
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio,
      quote: member.quote,
      image_url: member.image_url,
      instagram: member.instagram,
    });
    setPreview(member.image_url);
    setFile(null);
  }

  function cancelEdit() {
    setEditId(null);
    setForm({ ...EMPTY });
    setPreview("");
    setFile(null);
  }

  async function uploadImageIfNeeded(): Promise<string | null> {
    if (!file) return null;
    const ext = file.name.split(".").pop();
    const fileName = `team/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("media")
      .upload(fileName, file);
    if (error) return null;
    const { data } = supabase.storage.from("media").getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.role) return;
    setSubmitting(true);
    setError("");

    const imageUrl = (await uploadImageIfNeeded()) ?? form.image_url;

    if (editId) {
      const { error: updateError } = await supabase
        .from("founders")
        .update({ ...form, image_url: imageUrl })
        .eq("id", editId);

      if (updateError) {
        setError("Gagal menyimpan: " + updateError.message);
        setSubmitting(false);
        return;
      }
      setEditId(null);
    } else {
      const { error: insertError } = await supabase.from("founders").insert({
        ...form,
        image_url: imageUrl,
        order_index: members.length,
      });

      if (insertError) {
        setError("Gagal menyimpan: " + insertError.message);
        setSubmitting(false);
        return;
      }
    }

    setForm({ ...EMPTY });
    setFile(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
    await loadMembers();
    setSubmitting(false);
  }

  async function handleDelete(member: Founder) {
    if (!confirm(`Hapus "${member.name}" dari tim?`)) return;
    const path = getStoragePath(member.image_url ?? "", "media");
    if (path) await supabase.storage.from("media").remove([path]);
    await supabase.from("founders").delete().eq("id", member.id);
    setMembers((prev) => prev.filter((m) => m.id !== member.id));
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary text-sm focus:outline-none focus:border-accent-blue transition-colors";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Tim Kami</h1>
      <p className="text-sm text-text-secondary mb-8">
        Kelola anggota tim / founder Crypto Madura
      </p>

      {/* Form tambah / edit */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-base font-semibold mb-4">
          {editId ? "Edit Anggota Tim" : "Tambah Anggota Tim"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Nama *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                placeholder="Nama lengkap"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Jabatan *
              </label>
              <input
                type="text"
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className={inputClass}
                placeholder="Founder / Co-Founder / dll"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={2}
              className={`${inputClass} resize-none`}
              placeholder="Deskripsi singkat..."
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Quote
            </label>
            <input
              type="text"
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
              className={inputClass}
              placeholder="Kata-kata inspiratif..."
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Link Instagram
            </label>
            <input
              type="url"
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              className={inputClass}
              placeholder="https://instagram.com/username"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Foto
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-glass-border rounded-xl p-5 text-center cursor-pointer hover:border-accent-blue/50 transition-colors"
            >
              {preview ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto">
                  <Image
                    src={preview}
                    alt="preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-text-muted">
                  <Upload className="w-7 h-7" />
                  <p className="text-sm">Klik untuk pilih foto</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {error && <p className="text-sm text-accent-red">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-semibold hover:bg-accent-blue/90 transition-colors disabled:opacity-60 min-h-[44px]"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editId ? (
                <Check className="w-4 h-4" />
              ) : null}
              {submitting ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Tambah Anggota"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-glass-border text-text-secondary text-sm hover:bg-white/5 transition-colors min-h-[44px]"
              >
                <X className="w-4 h-4" />
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List members */}
      <h2 className="text-base font-semibold mb-4">
        Anggota Tim ({members.length})
      </h2>

      {loading ? (
        <div className="flex items-center gap-2 text-text-muted text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Memuat...
        </div>
      ) : members.length === 0 ? (
        <div className="glass-card p-8 text-center text-text-muted text-sm">
          Belum ada anggota tim.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {members.map((member) => (
            <div key={member.id} className="glass-card p-4 flex gap-4">
              <div className="w-16 h-16 rounded-full bg-bg-tertiary overflow-hidden flex-shrink-0">
                {member.image_url ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={member.image_url}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent-blue/30 to-accent-cyan/30 flex items-center justify-center text-lg font-bold text-text-muted">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{member.name}</p>
                <p className="text-xs text-accent-cyan">{member.role}</p>
                {member.bio && (
                  <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                    {member.bio}
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEdit(member)}
                    className="flex items-center gap-1.5 text-xs text-accent-blue hover:bg-accent-blue/10 px-3 py-1.5 rounded-lg transition-colors min-h-[36px]"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="flex items-center gap-1.5 text-xs text-accent-red hover:bg-accent-red/10 px-3 py-1.5 rounded-lg transition-colors min-h-[36px]"
                  >
                    <Trash2 className="w-3 h-3" />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
