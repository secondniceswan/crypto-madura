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
    <Wrapper {...wrapperProps} className="block">
      <Card hover className="flex flex-col h-full">
        <div className="w-full h-40 rounded-lg bg-bg-tertiary mb-4 overflow-hidden">
          {article.thumbnail && article.thumbnail.startsWith("http") ? (
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent-blue/20 to-accent-cyan/20 flex items-center justify-center text-text-muted text-sm">
              Thumbnail
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2 py-1 rounded-md bg-accent-blue/20 text-accent-blue">
            {article.category}
          </span>
          <span className="text-xs text-text-muted">{article.readTime}</span>
        </div>

        <h3 className="text-base font-semibold mb-2 line-clamp-2">
          {article.title}
        </h3>

        <p className="text-sm text-text-secondary line-clamp-3 flex-1">
          {article.excerpt}
        </p>

        <div className="mt-4 pt-3 border-t border-glass-border text-xs text-text-muted">
          {article.date}
        </div>
      </Card>
    </Wrapper>
  );
}
