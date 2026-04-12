"use client";

import { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import ArticleCard from "@/components/ui/ArticleCard";
import Modal from "@/components/ui/Modal";
import { fallbackArticles } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Article, NewsApiArticle } from "@/types";

function mapApiToArticle(item: NewsApiArticle): Article {
  return {
    id: item.article_id,
    title: item.title,
    excerpt: item.description || "Klik untuk membaca selengkapnya.",
    category: item.category?.[0] || "Crypto",
    date: new Date(item.pubDate).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    readTime: item.source_name,
    thumbnail: item.image_url || "",
    url: item.link,
  };
}

interface NewsPhoto {
  id: string;
  image_url: string;
  order_index: number;
}

interface ManualNewsRaw {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  news_photos: NewsPhoto[];
}

interface ManualArticle extends Article {
  photos: NewsPhoto[];
}

function mapManualToArticle(item: ManualNewsRaw): ManualArticle {
  const photos = (item.news_photos ?? []).sort(
    (a, b) => a.order_index - b.order_index
  );
  return {
    id: item.id,
    title: item.title,
    excerpt: item.excerpt || "",
    category: item.category,
    date: new Date(item.created_at).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    readTime: "Tim Kami",
    thumbnail: photos[0]?.image_url || "",
    photos,
  };
}

function ManualArticleCard({
  article,
  onClick,
}: {
  article: ManualArticle;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="block text-left w-full focus:outline-none focus:ring-2 focus:ring-accent-blue rounded-2xl"
    >
      <div className="glass-card flex flex-col h-full hover:border-accent-blue/30 transition-colors p-5">
        {article.thumbnail && (
          <div className="relative w-full h-40 rounded-lg bg-bg-tertiary mb-4 overflow-hidden">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {article.photos.length > 1 && (
              <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded-full">
                {article.photos.length} foto
              </span>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2 py-1 rounded-md bg-accent-blue/20 text-accent-blue">
            {article.category}
          </span>
          <span className="text-xs text-text-muted">{article.readTime}</span>
        </div>
        <h3 className="text-base font-semibold mb-2 line-clamp-2">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm text-text-secondary line-clamp-3 flex-1">
            {article.excerpt}
          </p>
        )}
        <div className="mt-4 pt-3 border-t border-glass-border text-xs text-text-muted">
          {article.date}
        </div>
      </div>
    </button>
  );
}

export default function News() {
  const [apiArticles, setApiArticles] = useState<Article[]>(fallbackArticles);
  const [manualArticles, setManualArticles] = useState<ManualArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ManualArticle | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  function openNews(article: ManualArticle) {
    setSelected(article);
    setPhotoIndex(0);
  }

  function closeModal() {
    setSelected(null);
    setPhotoIndex(0);
  }

  const photos = selected?.photos ?? [];

  useEffect(() => {
    const CACHE_KEY = "cm_news_cache";
    const CACHE_TTL = 60 * 60 * 1000;

    const supabase = createClient();
    supabase
      .from("news_manual")
      .select("*, news_photos(id, image_url, order_index)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setManualArticles(data.map(mapManualToArticle));
        }
      });

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL && data.length > 0) {
          setApiArticles(data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    fetch("/api/news")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const mapped = data.results.map(mapApiToArticle);
          setApiArticles(mapped);
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ data: mapped, timestamp: Date.now() })
            );
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="berita" className="section-container">
      <SectionHeader
        title="Berita & Analisis"
        subtitle="Update terbaru seputar pasar crypto dan analisis mendalam"
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="w-full h-40 rounded-lg bg-bg-tertiary mb-4" />
              <div className="h-4 bg-bg-tertiary rounded w-1/4 mb-2" />
              <div className="h-5 bg-bg-tertiary rounded w-3/4 mb-2" />
              <div className="h-4 bg-bg-tertiary rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {apiArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {manualArticles.length > 0 && (
            <div className="mt-10">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
                Dari Tim Kami
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {manualArticles.map((article) => (
                  <ManualArticleCard
                    key={article.id}
                    article={article}
                    onClick={() => openNews(article)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* News Modal */}
      <Modal open={!!selected} onClose={closeModal} maxWidth="max-w-xl">
        {selected && (
          <div className="flex flex-col overflow-hidden">
            {/* Photo viewer */}
            {photos.length > 0 && (
              <div className="relative bg-black flex items-center justify-center min-h-[200px] sm:min-h-[280px]">
                <img
                  src={photos[photoIndex]?.image_url}
                  alt={selected.title}
                  className="w-full max-h-[50vh] object-contain"
                />
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setPhotoIndex((i) =>
                          i === 0 ? photos.length - 1 : i - 1
                        )
                      }
                      className="absolute left-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                      aria-label="Foto sebelumnya"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setPhotoIndex((i) =>
                          i === photos.length - 1 ? 0 : i + 1
                        )
                      }
                      className="absolute right-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                      aria-label="Foto berikutnya"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                      {photos.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPhotoIndex(i)}
                          className={`h-1.5 rounded-full transition-all ${
                            i === photoIndex
                              ? "bg-white w-3"
                              : "bg-white/40 w-1.5"
                          }`}
                          aria-label={`Foto ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Info */}
            <div className="p-5 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold px-2 py-1 rounded-md bg-accent-blue/20 text-accent-blue">
                  {selected.category}
                </span>
                <span className="text-xs text-text-muted">{selected.date}</span>
                {photos.length > 1 && (
                  <span className="text-xs text-text-muted">
                    · {photos.length} foto
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold mb-3">{selected.title}</h2>
              {selected.excerpt && (
                <p className="text-sm text-text-secondary leading-relaxed">
                  {selected.excerpt}
                </p>
              )}

              {/* Thumbnail strip */}
              {photos.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                  {photos.map((photo, i) => (
                    <button
                      key={photo.id}
                      onClick={() => setPhotoIndex(i)}
                      className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                        i === photoIndex
                          ? "border-accent-blue"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={photo.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
