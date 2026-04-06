"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { SITE, NAV_ITEMS } from "@/lib/constants";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-2 min-h-[44px]">
            <Image
              src="/images/logo.png"
              alt="Crypto Madura"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="text-xl font-bold gradient-text">
              {SITE.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/5 min-h-[44px] flex items-center"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <a
            href={SITE.whatsappGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-2 bg-accent-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-blue/90 transition-colors shadow-[var(--shadow-glow-blue)] min-h-[44px]"
          >
            Gabung Komunitas
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-bg-secondary/95 backdrop-blur-md border-t border-glass-border">
          <div className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors min-h-[44px]"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={SITE.whatsappGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-center bg-accent-blue text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-accent-blue/90 transition-colors min-h-[44px]"
            >
              Gabung Komunitas
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
