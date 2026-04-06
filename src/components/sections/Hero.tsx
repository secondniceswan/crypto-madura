import { ArrowRight, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-bg-tertiary)_0%,_var(--color-bg-primary)_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(59,130,246,0.08)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,_rgba(6,182,212,0.06)_0%,_transparent_50%)]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 section-container text-center">
        <div className="max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-sm text-accent-blue mb-8">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            Komunitas Crypto #1 di Madura
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
            Bangun Legacy{" "}
            <span className="gradient-text">Crypto-mu</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed">
            Bergabung dengan komunitas trader dan investor crypto di Madura.
            Edukasi, sinyal trading, dan networking dalam satu platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={SITE.whatsappGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent-blue text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-accent-blue/90 transition-all shadow-[var(--shadow-glow-blue)] min-h-[44px] w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-5 h-5" />
              Gabung Komunitas
            </a>
            <a
              href="#layanan"
              className="inline-flex items-center gap-2 border border-accent-blue/50 text-accent-blue px-8 py-4 rounded-xl font-semibold text-base hover:bg-accent-blue/10 transition-all min-h-[44px] w-full sm:w-auto justify-center"
            >
              Lihat Layanan
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
