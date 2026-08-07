import Image from "next/image";
import { ArrowRight, MessageCircle, TrendingUp, ShieldCheck, GraduationCap } from "lucide-react";
import { SITE } from "@/lib/constants";
import Aurora from "@/components/ui/Aurora";

const TICKER = ["BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "DOGE", "TON", "AVAX", "LINK", "MATIC", "DOT"];

const HIGHLIGHTS = [
  { icon: GraduationCap, label: "Edukasi dari nol" },
  { icon: TrendingUp, label: "Sinyal harian" },
  { icon: ShieldCheck, label: "Manajemen risiko" },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(20,20,40,0.8)_0%,_var(--color-bg-primary)_65%)]" />
      <Aurora />
      <div className="absolute inset-0 grid-overlay opacity-60" />

      <div className="relative z-10 section-container">
        {/* minmax(0,…) keeps the ratio exact — plain fr lets a column's min-content
            widen it and eat into the illustration */}
        {/* Three blocks: headline, illustration, rest-of-copy. On mobile they stack in
            DOM order so the illustration lands between the headline and the subtitle.
            On desktop blocks 1 and 3 go back to column 1 (meeting at the middle via the
            two 1fr rows) and the illustration spans both rows in column 2. */}
        <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)] lg:grid-rows-[1fr_1fr] gap-x-8 gap-y-7 lg:gap-x-6 lg:gap-y-0 items-center">
          {/* ---------- Headline block ---------- */}
          <div className="lg:col-start-1 lg:row-start-1 lg:self-end text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-4">
              Bangun Legacy{" "}
              <span className="gradient-text">Crypto-mu</span>{" "}
              bareng komunitas.
            </h1>

            {/* Tagline (plain, no border/dot) */}
            <p className="text-sm sm:text-base lg:text-lg font-medium tracking-wide text-text-secondary lg:mb-6">
              Komunitas Crypto{" "}
              <span className="text-accent-cyan font-semibold">#1 di Madura</span>
            </p>
          </div>

          {/* ---------- Hero illustration ---------- */}
          {/* capped only below lg; on desktop it fills the column (+ a small bleed) */}
          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center relative mx-auto w-full max-lg:max-w-md lg:-mr-6 xl:-mr-10">
            {/* glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/20 via-accent-cyan/10 to-transparent blur-3xl rounded-full" />
            <Image
              src="/images/hero-crypto.webp"
              alt="Anggota komunitas tersenyum melihat portofolio crypto di ponsel dengan koin Bitcoin beterbangan"
              width={1700}
              height={1473}
              // This is the LCP element. `priority` is deprecated in Next 16, so
              // load eagerly at high fetch priority instead. React hoists a
              // <link rel=preload> for any eager img — that is deliberate, and
              // Firefox's "preloaded but not used" notice about it is a false
              // positive (setting Next's `preload={false}` does not suppress it).
              loading="eager"
              fetchPriority="high"
              className="relative w-full h-auto"
            />
          </div>

          {/* ---------- Rest of the copy ---------- */}
          <div className="lg:col-start-1 lg:row-start-2 lg:self-start text-center lg:text-left">
            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-text-secondary max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Bergabung dengan komunitas trader dan investor crypto di Madura.
              Edukasi, sinyal trading, dan networking dalam satu platform.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 mb-8">
              <a
                href={SITE.whatsappGroup}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-accent-blue to-accent-indigo text-white px-8 py-4 rounded-xl font-semibold text-base transition-all shadow-[var(--shadow-glow-blue)] hover:brightness-110 min-h-[44px] w-full sm:w-auto justify-center"
              >
                <MessageCircle className="w-5 h-5" />
                Gabung Komunitas
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#layanan"
                className="inline-flex items-center gap-2 border border-glass-border bg-white/[0.02] text-text-primary px-8 py-4 rounded-xl font-semibold text-base hover:bg-white/[0.06] hover:border-accent-blue/40 transition-all min-h-[44px] w-full sm:w-auto justify-center"
              >
                Lihat Layanan
              </a>
            </div>

            {/* Highlight chips */}
            <div className="flex flex-wrap items-center lg:justify-start justify-center gap-x-5 gap-y-2">
              {HIGHLIGHTS.map((h) => (
                <span key={h.label} className="inline-flex items-center gap-2 text-sm text-text-secondary">
                  <h.icon className="w-4 h-4 text-accent-cyan" />
                  {h.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative coin ticker */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-glass-border bg-bg-primary/40 backdrop-blur-sm py-3 overflow-hidden">
        <div className="flex w-max animate-scroll-logos gap-10">
          {[...TICKER, ...TICKER].map((sym, i) => (
            <span key={i} className="font-mono text-sm text-text-muted whitespace-nowrap">
              <span className="text-accent-cyan">◆</span> {sym}<span className="text-text-muted/50">/USDT</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
