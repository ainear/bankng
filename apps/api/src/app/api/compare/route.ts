import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@bankng/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const bank = searchParams.get("bank");
    const sort = searchParams.get("sort") ?? "bank_asc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(100, parseInt(searchParams.get("pageSize") || "50", 10));

    const where: Record<string, unknown> = {
      status: "active",
      isPublic: true,
      product: { status: "active", category: { isActive: true } }
    };

    if (category) {
      where.product = { ...((where.product as object) || {}), category: { slug: category, isActive: true } };
    }
    if (bank) {
      where.product = { ...((where.product as object) || {}), bank: { slug: bank, isActive: true } };
    }

    const orderBy = sort === "bank_asc" ? [{ product: { bank: { name: "asc" } } }] : undefined;

    const [total, items] = await Promise.all([
      prisma.financialProduct.count({ where }),
      prisma.financialProduct.findMany({
        where,
        orderBy: orderBy as never,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          bank: { select: { id: true, slug: true, name: true, logoUrl: true } },
          category: { select: { id: true, slug: true, name: true } },
          variants: {
            where: { status: "active" },
            include: {
              rates: {
                where: { status: "verified" },
                orderBy: { rateValue: "desc" },
                take: 1,
                include: { source: { select: { id: true, sourceName: true, reliabilityScore: true } } }
              }
            }
          }
        }
      })
    ]);

    let sorted = items.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      shortDescription: product.shortDescription,
      bank: product.bank,
      category: product.category,
      variants: product.variants.map((variant) => ({
        id: variant.id,
        variantName: variant.variantName,
        minTermMonth: variant.minTermMonth,
        maxTermMonth: variant.maxTermMonth,
        topRate: variant.rates[0]
          ? {
              rateValue: Number(variant.rates[0].rateValue),
              rateUnit: variant.rates[0].rateUnit,
              termValue: variant.rates[0].termValue,
              termUnit: variant.rates[0].termUnit,
              effectiveFrom: variant.rates[0].effectiveFrom,
              source: variant.rates[0].source
            }
          : null
      }))
    }));

    if (sort === "rate_desc") {
      sorted = sorted.sort((a, b) => {
        const aRate = a.variants[0]?.topRate?.rateValue ?? 0;
        const bRate = b.variants[0]?.topRate?.rateValue ?? 0;
        return bRate - aRate;
      });
    }

    return NextResponse.json({ items: sorted, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    console.error("[/api/compare]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}