import { prisma } from "@bankng/db";

export type ArticleWithCategory = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  categoryName: string;
  categorySlug: string;
  authorName: string | null;
  readTimeMin: number | null;
  coverImage: string | null;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function getArticles(opts?: {
  categorySlug?: string;
  limit?: number;
  featured?: boolean;
}): Promise<ArticleWithCategory[]> {
  const where: Record<string, unknown> = {
    status: "active",
  };

  if (opts?.categorySlug) {
    where.category = { slug: opts.categorySlug };
  }

  if (opts?.featured !== undefined) {
    where.isFeatured = opts.featured;
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: opts?.limit,
    include: {
      category: true,
    },
  });

  return articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    categoryName: a.category.name,
    categorySlug: a.category.slug,
    authorName: a.authorName,
    readTimeMin: a.readTimeMin,
    coverImage: a.coverImage,
    isFeatured: a.isFeatured,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  }));
}

export async function getArticle(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!article || article.status !== "active") {
    return null;
  }

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    categoryName: article.category.name,
    categorySlug: article.category.slug,
    authorName: article.authorName,
    readTimeMin: article.readTimeMin,
    coverImage: article.coverImage,
    isFeatured: article.isFeatured,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
}

export async function getArticleCategories() {
  const categories = await prisma.articleCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      articles: {
        where: { status: "active" },
        select: { id: true },
      },
    },
  });

  return categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    sortOrder: c.sortOrder,
    articleCount: c.articles.length,
  }));
}
