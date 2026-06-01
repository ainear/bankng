import { prisma } from "@bankng/db";
import { MOCK_ARTICLES, MOCK_ARTICLE_CATEGORIES } from "./mock-data";

export let isOffline = false;

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
  try {
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

    isOffline = false;

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
  } catch (err) {
    console.warn("getArticles offline, falling back to MOCK_ARTICLES:", err);
    isOffline = true;

    let filtered = [...MOCK_ARTICLES];
    if (opts?.categorySlug) {
      filtered = filtered.filter(a => a.categorySlug === opts.categorySlug);
    }
    if (opts?.featured !== undefined) {
      filtered = filtered.filter(a => a.isFeatured === opts.featured);
    }
    if (opts?.limit) {
      filtered = filtered.slice(0, opts.limit);
    }
    return filtered;
  }
}

export async function getArticle(slug: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    isOffline = false;

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
  } catch (err) {
    console.warn(`getArticle(${slug}) offline, falling back to MOCK_ARTICLES:`, err);
    isOffline = true;
    return MOCK_ARTICLES.find(a => a.slug === slug) ?? null;
  }
}

export async function getArticleCategories() {
  try {
    const categories = await prisma.articleCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        articles: {
          where: { status: "active" },
          select: { id: true },
        },
      },
    });

    isOffline = false;

    return categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      sortOrder: c.sortOrder,
      articleCount: c.articles.length,
    }));
  } catch (err) {
    console.warn("getArticleCategories offline, falling back to MOCK_ARTICLE_CATEGORIES:", err);
    isOffline = true;
    return MOCK_ARTICLE_CATEGORIES;
  }
}
