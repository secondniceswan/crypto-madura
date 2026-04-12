/**
 * Extract the storage path from a Supabase public URL.
 * e.g. "https://xxx.supabase.co/storage/v1/object/public/media/events/123.jpg"
 * → "events/123.jpg"
 *
 * Returns null if the URL is not a valid Supabase storage URL for the given bucket.
 */
export function getStoragePath(url: string, bucket: string): string | null {
  if (!url) return null;
  try {
    const marker = `/object/public/${bucket}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    const path = url.slice(idx + marker.length);
    return path || null;
  } catch {
    return null;
  }
}
