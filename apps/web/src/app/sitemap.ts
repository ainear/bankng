import type { MetadataRoute } from "next";
import { prisma } from "@bankng/db";

// Force dynamic — sitemap phụ thuộc vào DB, không thể prerender lúc build
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://bankng.vn";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/tin-tuc`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/danh-sach-bankers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/thuat-ngu`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/san-pham-cong-dong`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  ];

  try {
    const [banks, products, categories, articles] = await Promise.all([
      prisma.bank.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      prisma.financialProduct.findMany({ where: { isPublic: true, status: "active" }, select: { slug: true, updatedAt: true } }),
      prisma.productCategory.findMany({ where: { isActive: true, compareEnabled: true }, select: { slug: true } }),
      prisma.article.findMany({ where: { status: "active" }, select: { slug: true, updatedAt: true } }),
    ]);

    return [
      ...staticRoutes,
      ...categories.map((c) => ({ url: `${baseUrl}/compare/${c.slug}`, changeFrequency: "daily" as const, priority: 0.9 })),
      ...banks.map((b) => ({ url: `${baseUrl}/bank/${b.slug}`, lastModified: b.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
      ...products.map((p) => ({ url: `${baseUrl}/product/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
      ...articles.map((a) => ({ url: `${baseUrl}/tin-tuc/${a.slug}`, lastModified: a.updatedAt, changeFrequency: "weekly" as const, priority: 0.6 })),
    ];
  } catch {
    // DB không có sẵn lúc build — trả về static routes
    return staticRoutes;
  }
}
