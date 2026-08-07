import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * True only when real Supabase credentials are present. The placeholder values
 * shipped in .env.example count as "not configured", so local previews and
 * misconfigured deploys degrade to empty states instead of crashing the page.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    url &&
      anonKey &&
      !url.includes("your-project") &&
      anonKey !== "your_anon_key_here"
  );
}

export async function createClient() {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = await cookies();

  return createServerClient(url!, anonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
  });
}
