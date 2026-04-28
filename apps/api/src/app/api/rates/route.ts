import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@bankng/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productVariantId = searchParams.get("productVariantId");
    const bankId = searchParams.get("bankId");
    const status = searchParams.get("status") || "verified";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(100, parseInt(searchParams.get("pageSize") || "50", 10));

    const where: Record<string, unknown> = { status };
    if (productVariantId) where.productVariantId = productVariantId;
    if (bankId) where.productVariant = { product: { bankId } };

    const [total, items] = await Promise.all([
      prisma.interestRateSnapshot.count({ where }),
      prisma.interestRateSnapshot.findMany({
        where,
        orderBy: { effectiveFrom: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          productVariant: {
            include: {
              product: { select: { id: true, name: true, slug: true, bank: { select: { name: true, slug: true } } } }
            }
          },
          branch: { select: { id: true, branchName: true, address: true } },
          source: { select: { id: true, sourceName: true, sourceType: true, reliabilityScore: true } }
        }
      })
    ]);

    const formatted = items.map((rate) => ({
      id: rate.id,
      rateValue: Number(rate.rateValue),
      rateUnit: rate.rateUnit,
      rateType: rate.rateType,
      termValue: rate.termValue,
      termUnit: rate.termUnit,
      minAmount: rate.minAmount ? Number(rate.minAmount) : null,
      maxAmount: rate.maxAmount ? Number(rate.maxAmount) : null,
      effectiveFrom: rate.effectiveFrom,
      effectiveTo: rate.effectiveTo,
      status: rate.status,
      product: rate.productVariant.product,
      branch: rate.branch,
      source: rate.source
    }));

    return NextResponse.json({ items: formatted, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    console.error("[/api/rates]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}