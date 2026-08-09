import { Newspaper, ArrowUpRight } from "lucide-react";
import type { Article } from "@/types";
import Card from "./Card";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const Wrapper = article.url ? "a" : "div";
  const wrapperProps = article.url
    ? { href: article.url, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper {...wrapperProps} className="block h-full">
      <Card hover className="group flex flex-col h-full p-0 overflow-hidden">
        <div className="relative w-full h-44 mask-arc-bottom bg-bg-tertiary overflow-hidden">
          {article.thumbnail && article.thumbnail.startsWith("http") ? (
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent-blue/20 via-bg-tertiary to-accent-cyan/15 flex items-center justify-center">
              <Newspaper className="w-8 h-8 text-text-muted/60" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-sm text-accent-cyan border border-white/10">
            {article.category}
          </span>
        </div>

        <div className="flex flex-col flex-1 p-5">
          {/* the hover tint only belongs on cards that really navigate somewhere */}
          <h3
            className={`text-base font-semibold mb-2 line-clamp-2 transition-colors ${
              article.url ? "group-hover:text-accent-cyan" : ""
            }`}
          >
            {article.title}
          </h3>
          <p className="text-sm text-text-secondary line-clamp-3 flex-1">
            {article.excerpt}
          </p>
          <div className="mt-4 pt-3 border-t border-glass-border flex items-center justify-between text-xs text-text-muted">
            <span>{article.date}</span>
            <span className="inline-flex items-center gap-1">
              {article.readTime}
              {article.url && <ArrowUpRight className="w-3.5 h-3.5" />}
            </span>
          </div>
        </div>
      </Card>
    </Wrapper>
  );
}
