"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, MessageCircle } from "lucide-react";
import { SITE, NAV_ITEMS } from "@/lib/constants";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("#home");

  // Shrink + frost the bar after a little scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the section currently in view
  useEffect(() => {
    const ids = ["home", ...NAV_ITEMS.map((i) => i.href.replace("#", ""))];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg-primary/70 backdrop-blur-xl border-b border-glass-border shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-14" : "h-16 sm:h-20"
          }`}
        >
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-2.5 min-h-[44px] group">
            <span className="relative">
              <span className="absolute -inset-2 rounded-full bg-accent-blue/25 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image
                src="/images/logo.png"
                alt="Crypto Madura"
                width={36}
                height={36}
                className="relative"
              />
            </span>
            <span className="text-lg sm:text-xl font-bold gradient-text tracking-tight">
              {SITE.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 rounded-full border border-glass-border bg-white/[0.03] px-1.5 py-1 backdrop-blur-md">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm rounded-full transition-colors ${
                    isActive
                      ? "text-text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-white/[0.07] ring-1 ring-white/10" />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <a
            href={SITE.whatsappGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-indigo px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-[var(--shadow-glow-blue)] hover:brightness-110 min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4" />
            Gabung
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-bg-secondary/95 backdrop-blur-xl border-t border-glass-border">
          <div className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-sm rounded-lg transition-colors min-h-[44px] ${
                  active === item.href
                    ? "text-text-primary bg-white/5"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={SITE.whatsappGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 mt-4 bg-gradient-to-r from-accent-blue to-accent-indigo text-white px-5 py-3 rounded-xl text-sm font-semibold min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              Gabung Komunitas
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
