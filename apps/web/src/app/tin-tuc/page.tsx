import Link from "next/link";
import { getArticles, getArticleCategories } from "@/modules/public/data-articles";
import { ArticleCard } from "@/modules/public/components/article-card";

export const dynamic = "force-dynamic";

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [articles, categories] = await Promise.all([
    getArticles({ categorySlug: category }),
    getArticleCategories(),
  ]);

  const featuredArticle = articles.find((a) => a.isFeatured) ?? articles[0];
  const restArticles = articles.filter((a) => a !== featuredArticle);

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Tin tức &amp; Cẩm nang</h1>
          <p className="mt-2 text-[var(--bankng-text-secondary)]">
            Cập nhật thông tin tài chính mới nhất, cẩm nang hướng dẫn và phân tích chuyên sâu về thị trường ngân hàng Việt Nam.
          </p>
        </div>

        {/* Category filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/tin-tuc"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !category
                ? "bg-[var(--bankng-primary)] text-white"
                : "bg-[var(--bankng-surface-muted)] text-[var(--bankng-text-secondary)] hover:bg-[var(--bankng-surface)]"
            }`}
          >
            Tất cả
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tin-tuc?category=${cat.slug}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat.slug
                  ? "bg-[var(--bankng-primary)] text-white"
                  : "bg-[var(--bankng-surface-muted)] text-[var(--bankng-text-secondary)] hover:bg-[var(--bankng-surface)]"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {articles.length === 0 ? (
          <div className="py-12 text-center text-[var(--bankng-text-secondary)]">
          Chưa có bài viết nào trong mục này.
          </div>
        ) : (
          <>
            {/* Featured article */}
            {featuredArticle && (
              <div className="mb-8">
                <ArticleCard article={featuredArticle} featured />
              </div>
            )}

            {/* Article grid */}
            {restArticles.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {restArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
