"use client";

import { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import ArticleCard from "@/components/ui/ArticleCard";
import { fallbackArticles } from "@/lib/data";
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
    readTime: `${item.source_name}`,
    thumbnail: item.image_url || "",
    url: item.link,
  };
}

export default function News() {
  const [articles, setArticles] = useState<Article[]>(fallbackArticles);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
    if (!apiKey) {
      setLoading(false);
      return;
    }

    fetch(
      `https://newsdata.io/api/1/crypto?apikey=${apiKey}&language=id,en&size=6`
    )
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        if (data.results && data.results.length > 0) {
          setArticles(data.results.map(mapApiToArticle));
        }
      })
      .catch(() => {
        // Keep fallback articles
      })
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}
