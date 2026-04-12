"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ImagePlus, Users, Newspaper, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [counts, setCounts] = useState({
    events: 0,
    founders: 0,
    news: 0,
  });

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase.from("founders").select("id", { count: "exact", head: true }),
      supabase.from("news_manual").select("id", { count: "exact", head: true }),
    ]).then(([events, founders, news]) => {
      setCounts({
        events: events.count ?? 0,
        founders: founders.count ?? 0,
        news: news.count ?? 0,
      });
    });
  }, []);

  const cards = [
    {
      href: "/cm-admin-panel/events",
      label: "Events",
      count: counts.events,
      icon: ImagePlus,
      color: "text-accent-cyan",
      bg: "bg-accent-cyan/10",
    },
    {
      href: "/cm-admin-panel/team",
      label: "Tim Kami",
      count: counts.founders,
      icon: Users,
      color: "text-accent-blue",
      bg: "bg-accent-blue/10",
    },
    {
      href: "/cm-admin-panel/news",
      label: "Berita Manual",
      count: counts.news,
      icon: Newspaper,
      color: "text-accent-green",
      bg: "bg-accent-green/10",
    },
    {
      href: "/cm-admin-panel/contact",
      label: "Kontak",
      count: null,
      icon: MessageSquare,
      color: "text-accent-amber",
      bg: "bg-accent-amber/10",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-sm text-text-secondary mb-8">
        Selamat datang di Admin Panel Crypto Madura
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ href, label, count, icon: Icon, color, bg }) => (
          <Link
            key={href}
            href={href}
            className="glass-card p-5 hover:border-accent-blue/30 transition-colors group"
          >
            <div
              className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}
            >
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-sm text-text-secondary">{label}</p>
            {count !== null && (
              <p className="text-2xl font-bold mt-1">{count}</p>
            )}
            <p
              className={`text-xs mt-2 ${color} opacity-0 group-hover:opacity-100 transition-opacity`}
            >
              Kelola →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
