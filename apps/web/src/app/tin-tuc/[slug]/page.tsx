import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getArticle, getArticles } from "@/modules/public/data-articles";
import { ArticleCard } from "@/modules/public/components/article-card";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Bài viết không tồn tại | Bankng",
      description: "Bài viết tài chính bạn đang tìm kiếm hiện không tồn tại hoặc đã được di chuyển."
    };
  }

  const siteTitle = `${article.title} | Bankng — Tin tức tài chính`;
  const siteDesc = article.excerpt 
    ? (article.excerpt.length > 155 ? `${article.excerpt.slice(0, 152)}...` : article.excerpt)
    : `Đọc bài viết ${article.title} thuộc chuyên mục ${article.categoryName}. Cập nhật tin tức tài chính, lãi suất ngân hàng và cẩm nang vay vốn tại Bankng.vn.`;

  return {
    title: siteTitle,
    description: siteDesc,
    keywords: `${article.title}, tin tức tài chính, ${article.categoryName}, cẩm nang vay vốn, ngân hàng Việt Nam`,
    openGraph: {
      title: article.title,
      description: siteDesc,
      type: "article",
      ...(article.coverImage ? { images: [article.coverImage] } : {}),
    },
  };
}


function formatDate(date: Date) {
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, relatedArticles] = await Promise.all([
    getArticle(slug),
    getArticles({ limit: 3 }),
  ]);

  if (!article) {
    notFound();
  }

  const related = relatedArticles
    .filter((a) => a.slug !== slug && a.categorySlug === article.categorySlug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.excerpt || article.title,
    "image": article.coverImage ? [article.coverImage] : [],
    "datePublished": article.createdAt instanceof Date ? article.createdAt.toISOString() : new Date(article.createdAt).toISOString(),
    "dateModified": article.updatedAt instanceof Date ? article.updatedAt.toISOString() : new Date(article.updatedAt).toISOString(),
    "author": article.authorName ? [{
      "@type": "Person",
      "name": article.authorName
    }] : [],
    "publisher": {
      "@type": "Organization",
      "name": "Bankng",
      "logo": {
        "@type": "ImageObject",
        "url": "https://bankng.vn/logo.png"
      }
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6">
          <Link className="text-sm text-[var(--bankng-primary)]" href="/tin-tuc">
          ← Quay lại Tin tức
          </Link>
        </div>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 text-sm text-[var(--bankng-text-secondary)]">
              <Link
                href={`/tin-tuc?category=${article.categorySlug}`}
                className="rounded-full bg-[var(--bankng-surface-muted)] px-3 py-0.5 hover:bg-[var(--bankng-surface)]"
              >
                {article.categoryName}
              </Link>
              <span>•</span>
              <span>{formatDate(article.createdAt)}</span>
              {article.readTimeMin && (
                <>
                  <span>•</span>
                  <span>{article.readTimeMin} phút đọc</span>
                </>
              )}
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight">
              {article.title}
            </h1>
            {article.authorName && (
              <p className="mt-3 text-sm text-[var(--bankng-text-secondary)]">
                Tác giả: {article.authorName}
              </p>
            )}
          </header>

          {article.coverImage && (
            <Image
              src={article.coverImage}
              alt={article.title}
              width={800}
              height={450}
              priority={true}
              fetchPriority="high"
              className="mb-8 w-full rounded-lg object-cover"
            />
          )}

          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        <div className="mt-12 rounded-lg border border-[var(--bankng-border)] bg-[var(--bankng-surface)] p-6">
          <h3 className="font-semibold">Bạn cần tư vấn thêm?</h3>
          <p className="mt-2 text-sm text-[var(--bankng-text-secondary)]">
            Để lại thông tin, nhân viên ngân hàng sẽ liên hệ bạn trong 24h.
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/danh-sach-bankers">
              <button className="rounded-md bg-[var(--bankng-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--bankng-primary)]/90">
                Xem danh sách nhân viên
              </button>
            </Link>
            <Link href="/danh-gia-nhanh/vay-mua-nha">
              <button className="rounded-md border border-[var(--bankng-border)] bg-white px-4 py-2 text-sm font-medium hover:bg-[var(--bankng-surface)]">
                Tính toán vay mua nhà
              </button>
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-xl font-semibold">Bài viết liên quan</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
