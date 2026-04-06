import Image from "next/image";
import { Globe, MessageCircle, Mail, ExternalLink, FileText } from "lucide-react";
import { SITE, NAV_ITEMS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/images/logo.png"
                alt="Crypto Madura"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <h3 className="text-lg font-bold gradient-text">
                {SITE.name}
              </h3>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {SITE.description}
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
                  <a
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
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
                <a
                  href={SITE.whatsappAdmin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat Admin
                </a>
              </li>
              <li>
                <a
                  href={SITE.exchangeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Exchange BingX
                </a>
              </li>
              <li>
                <a
                  href={SITE.complainForm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Form Aduan
                </a>
              </li>
            </ul>
          </div>

          {/* Hubungi Kami */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
              Hubungi Kami
            </h4>
            <div className="flex gap-3">
              <a
                href={SITE.whatsappGroup}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-text-secondary hover:text-accent-green hover:bg-accent-green/10 transition-colors"
                aria-label="WhatsApp Group"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-text-secondary hover:text-accent-amber hover:bg-accent-amber/10 transition-colors"
                aria-label="Instagram"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-text-secondary hover:text-accent-blue hover:bg-accent-blue/10 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-8 border-t border-glass-border">
          <p className="text-xs text-text-muted leading-relaxed mb-4">
            <strong>Disclaimer:</strong> Crypto Madura bukan penasihat keuangan.
            Semua informasi yang diberikan bersifat edukatif dan bukan merupakan
            saran investasi. Trading cryptocurrency memiliki risiko tinggi.
            Lakukan riset mandiri sebelum mengambil keputusan investasi.
          </p>
          <p className="text-xs text-text-muted text-center">
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
