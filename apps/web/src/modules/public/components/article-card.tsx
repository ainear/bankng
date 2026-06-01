import Link from "next/link";
import Image from "next/image";
import type { ArticleWithCategory } from "../data-articles";

type Props = {
  article: ArticleWithCategory;
  featured?: boolean;
};

function formatDate(date: Date) {
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function ArticleCard({ article, featured = false }: Props) {
  if (featured) {
    return (
      <Link
        href={`/tin-tuc/${article.slug}`}
        className="group block rounded-lg border border-[var(--bankng-border)] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="flex gap-6">
          {article.coverImage && (
            <div className="w-48 flex-shrink-0">
              <Image
                src={article.coverImage}
                alt={article.title}
                width={192}
                height={128}
                className="h-32 w-full rounded-md object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-[var(--bankng-text-secondary)]">
              <span className="rounded-full bg-[var(--bankng-surface-muted)] px-2 py-0.5">
                {article.categoryName}
              </span>
              <span>•</span>
              <span>{formatDate(article.createdAt)}</span>
              {article.readTimeMin && (
                <>
                  <span>•</span>
                  <span>{article.readTimeMin} phút đọc</span>
                </>
              )}
            </div>
            <h3 className="mt-2 text-xl font-semibold text-[var(--bankng-text-primary)] group-hover:text-[var(--bankng-primary)]">
              {article.title}
            </h3>
            {article.excerpt && (
              <p className="mt-2 line-clamp-2 text-sm text-[var(--bankng-text-secondary)]">
                {article.excerpt}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/tin-tuc/${article.slug}`}
      className="group block rounded-lg border border-[var(--bankng-border)] bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {article.coverImage && (
        <Image
          src={article.coverImage}
          alt={article.title}
          width={320}
          height={160}
          className="h-40 w-full rounded-t-lg object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-[var(--bankng-text-secondary)]">
          <span className="rounded-full bg-[var(--bankng-surface-muted)] px-2 py-0.5">
            {article.categoryName}
          </span>
          <span>•</span>
          <span>{formatDate(article.createdAt)}</span>
          {article.readTimeMin && (
            <>
              <span>•</span>
              <span>{article.readTimeMin} phút đọc</span>
            </>
          )}
        </div>
        <h3 className="mt-2 font-semibold text-[var(--bankng-text-primary)] group-hover:text-[var(--bankng-primary)]">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-1 line-clamp-2 text-sm text-[var(--bankng-text-secondary)]">
            {article.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
