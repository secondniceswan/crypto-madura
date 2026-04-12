"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email atau password salah.");
      setLoading(false);
      return;
    }

    router.push("/cm-admin-panel/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm">
        <div className="glass-card p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent-blue/20 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-accent-blue" />
            </div>
            <h1 className="text-xl font-bold gradient-text">Admin Panel</h1>
            <p className="text-sm text-text-secondary mt-1">Crypto Madura</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-text-secondary mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary text-sm focus:outline-none focus:border-accent-blue transition-colors"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm text-text-secondary mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary text-sm focus:outline-none focus:border-accent-blue transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-accent-red text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-accent-blue text-white text-sm font-semibold hover:bg-accent-blue/90 transition-colors disabled:opacity-60 min-h-[44px]"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
