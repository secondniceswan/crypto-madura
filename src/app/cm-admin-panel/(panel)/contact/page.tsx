"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Check } from "lucide-react";

export default function AdminContactPage() {
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("contact")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setWhatsapp(data.whatsapp_url ?? "");
          setInstagram(data.instagram_url ?? "");
        }
        setLoading(false);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    const { error: updateError } = await supabase
      .from("contact")
      .update({ whatsapp_url: whatsapp, instagram_url: instagram })
      .eq("id", 1);

    if (updateError) {
      setError("Gagal menyimpan: " + updateError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary text-sm focus:outline-none focus:border-accent-blue transition-colors";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Kontak</h1>
      <p className="text-sm text-text-secondary mb-8">
        Edit link WhatsApp dan Instagram yang tampil di footer
      </p>

      <div className="glass-card p-6 max-w-lg">
        {loading ? (
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Memuat...
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Link WhatsApp Group
              </label>
              <input
                type="url"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className={inputClass}
                placeholder="https://chat.whatsapp.com/..."
              />
              <p className="text-xs text-text-muted mt-1">
                Link grup WhatsApp komunitas
              </p>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Link Instagram
              </label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className={inputClass}
                placeholder="https://instagram.com/cryptomadura"
              />
            </div>

            {error && <p className="text-sm text-accent-red">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-semibold hover:bg-accent-blue/90 transition-colors disabled:opacity-60 min-h-[44px]"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <Check className="w-4 h-4" />
              ) : null}
              {saving ? "Menyimpan..." : saved ? "Tersimpan!" : "Simpan Perubahan"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
