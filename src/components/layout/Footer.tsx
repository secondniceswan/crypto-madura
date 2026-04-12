import Image from "next/image";
import { ExternalLink, FileText, MessageCircle } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

interface SocialLink {
  id: number;
  platform: string;
  label: string;
  url: string;
  enabled: boolean;
  order_index: number;
}

function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  switch (platform) {
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "threads":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.513 5.465l-2.433.678c-1.084-3.888-3.71-5.851-7.907-5.88-2.797.019-4.974.908-6.476 2.64-1.44 1.66-2.173 4.08-2.198 7.196.025 3.11.76 5.533 2.2 7.196 1.502 1.731 3.677 2.619 6.476 2.638 2.553-.02 4.342-.648 5.764-2.058 1.648-1.629 1.936-3.656 1.568-4.977-.24-.865-.742-1.58-1.459-2.069-.174 1.084-.522 2.033-1.048 2.841-1.049 1.601-2.683 2.498-4.72 2.589-1.565.07-3.055-.373-4.196-1.239-1.27-.962-1.975-2.356-1.975-3.878 0-3.152 2.557-5.135 6.49-5.135.602 0 1.196.04 1.777.117-.13-.87-.479-1.576-1.032-2.077-.647-.585-1.572-.882-2.752-.882h-.055c-.95.005-2.378.283-3.208 1.93l-2.158-1.2c1.239-2.49 3.468-3.733 6.42-3.733h.072c4.557.02 7.064 2.618 7.16 7.278.045 2.28-.538 4.335-1.655 5.784C18.91 22.63 16.75 24 12.186 24z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );
    case "telegram":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      );
    default:
      return null;
  }
}

const PLATFORM_HOVER: Record<string, string> = {
  whatsapp: "hover:text-[#25D366] hover:bg-[#25D366]/10",
  instagram: "hover:text-[#E1306C] hover:bg-[#E1306C]/10",
  x: "hover:text-white hover:bg-white/10",
  threads: "hover:text-white hover:bg-white/10",
  youtube: "hover:text-[#FF0000] hover:bg-[#FF0000]/10",
  tiktok: "hover:text-white hover:bg-white/10",
  telegram: "hover:text-[#26A5E4] hover:bg-[#26A5E4]/10",
};

export default async function Footer() {
  const supabase = await createClient();
  const { data: socialLinks } = await supabase
    .from("social_links")
    .select("id, platform, label, url, enabled, order_index")
    .eq("enabled", true)
    .order("order_index");

  const activeSocials = (socialLinks ?? []).filter((s: SocialLink) => s.url);

  return (
    <footer className="bg-bg-secondary border-t border-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/images/logo.png" alt="Crypto Madura" width={32} height={32} className="rounded-lg" />
              <h3 className="text-lg font-bold gradient-text">Crypto Madura</h3>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Komunitas edukasi dan trading crypto untuk masyarakat Madura
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
              Navigasi
            </h4>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link Penting */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
              Link Penting
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="https://s.id/waAdmin-" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Chat Admin
                </a>
              </li>
              <li>
                <a href="https://bingx.pro/id-id/invite/M82LPG" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  Exchange BingX
                </a>
              </li>
              <li>
                <a href="https://forms.gle/KppDqqaXbRN1AYcX8" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
                  <FileText className="w-4 h-4" />
                  Form Aduan
                </a>
              </li>
            </ul>
          </div>

          {/* Sosmed Kami */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
              Sosmed Kami
            </h4>
            {activeSocials.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {activeSocials.map((social: SocialLink) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-text-secondary transition-colors ${PLATFORM_HOVER[social.platform] ?? "hover:text-text-primary hover:bg-white/10"}`}
                    aria-label={social.label}
                  >
                    <SocialIcon platform={social.platform} className="w-5 h-5" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">Belum ada sosmed aktif.</p>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-glass-border">
          <p className="text-xs text-text-muted leading-relaxed mb-4">
            <strong>Disclaimer:</strong> Crypto Madura bukan penasihat keuangan. Semua informasi yang diberikan bersifat edukatif dan bukan merupakan saran investasi. Trading cryptocurrency memiliki risiko tinggi. Lakukan riset mandiri sebelum mengambil keputusan investasi.
          </p>
          <p className="text-xs text-text-muted text-center">
            &copy; {new Date().getFullYear()} Crypto Madura. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
