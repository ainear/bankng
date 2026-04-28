import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@bankng/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const hasProducts = searchParams.get("hasProducts") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(100, parseInt(searchParams.get("pageSize") || "50", 10));

    if (slug) {
      const bank = await prisma.bank.findUnique({
        where: { slug, isActive: true },
        include: {
          branches: { where: { isActive: true }, select: { id: true, branchName: true, address: true, provinceCode: true } },
          products: { where: { status: "active", isPublic: true }, select: { id: true, name: true, slug: true, category: { select: { name: true, slug: true } } } }
        }
      });
      if (!bank) return NextResponse.json({ error: "Bank not found" }, { status: 404 });
      return NextResponse.json({ items: [bank], total: 1, page: 1, pageSize: 1, totalPages: 1 });
    }

    const where: Record<string, unknown> = { isActive: true };
    if (hasProducts) where.products = { some: { status: "active", isPublic: true } };

    const [total, items] = await Promise.all([
      prisma.bank.count({ where }),
      prisma.bank.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true, slug: true, name: true, shortName: true, hotline: true,
          websiteUrl: true, logoUrl: true, description: true,
          _count: { select: { products: { where: { status: "active", isPublic: true } }, branches: { where: { isActive: true } } } }
        }
      })
    ]);

    const formatted = items.map((bank) => ({
      id: bank.id, slug: bank.slug, name: bank.name, shortName: bank.shortName,
      hotline: bank.hotline, websiteUrl: bank.websiteUrl, logoUrl: bank.logoUrl, description: bank.description,
      productCount: bank._count.products, branchCount: bank._count.branches
    }));

    return NextResponse.json({ items: formatted, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    console.error("[/api/banks]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}