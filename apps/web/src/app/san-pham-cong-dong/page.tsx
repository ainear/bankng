import { prisma } from "@bankng/db";
import Link from "next/link";
import { cleanLogoUrl } from "@/components/bank-logo-helper";

export const dynamic = "force-dynamic";

async function getCommunityProducts() {
  try {
    return await prisma.financialProduct.findMany({
      where: { isPublic: true, status: "active" },
      orderBy: [{ featuredRank: "asc" }, { updatedAt: "desc" }],
      take: 30,
      include: {
        bank: {
          select: { name: true, slug: true, shortName: true, logoUrl: true },
        },
        category: { select: { name: true, slug: true } },
        variants: {
          where: { status: "active" },
          take: 1,
          include: {
            rates: {
              where: { status: "verified" },
              orderBy: { rateValue: "desc" },
              take: 1,
            },
          },
        },
      },
    });
  } catch {
    return [];
  }
}

function formatDate(date: Date) {
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function CommunityProductsPage() {
  const products = await getCommunityProducts();

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sản phẩm cộng đồng</h1>
            <p className="mt-2 text-[var(--bankng-text-secondary)]">
              Khám phá và đánh giá các sản phẩm ngân hàng được người dùng đề xuất.
            </p>
          </div>
          <Link
            href="/banker/dang-ky"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--bankng-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--bankng-primary)]/90"
          >
            + Liên hệ tư vấn
          </Link>
        </div>

        {/* Sort/filter bar */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <span className="text-[var(--bankng-text-secondary)]">Sắp xếp:</span>
          <span className="rounded-full bg-[var(--bankng-primary)] px-3 py-1 font-medium text-white">
            Nổi bật
          </span>
          <Link
            href="/compare"
            className="rounded-full bg-[var(--bankng-surface-muted)] px-3 py-1 font-medium text-[var(--bankng-text-secondary)] hover:bg-[var(--bankng-surface)]"
          >
            So sánh đầy đủ →
          </Link>
        </div>

        {/* Products list */}
        {products.length === 0 ? (
          <div className="rounded-xl border border-[var(--bankng-border)] bg-white py-16 text-center">
            <div className="text-4xl">🏦</div>
            <p className="mt-3 font-medium text-[var(--bankng-text-primary)]">
              Chưa có sản phẩm nào
            </p>
            <p className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
              Dữ liệu sản phẩm đang được cập nhật. Vui lòng quay lại sau.
            </p>
            <Link
              href="/compare"
              className="mt-4 inline-block rounded-lg bg-[var(--bankng-primary)] px-6 py-2.5 text-sm font-medium text-white"
            >
              Xem bảng so sánh →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product, idx) => {
              const bestRate = product.variants[0]?.rates[0];
              const bankLink = `/bank/${product.bank.slug}`;
              const productLink = `/product/${product.slug}`;

              return (
                <div
                  key={product.id}
                  className="rounded-xl border border-[var(--bankng-border)] bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    {/* Rank */}
                    <div className="flex shrink-0 flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bankng-surface-muted)] text-sm font-bold text-[var(--bankng-text-secondary)]">
                        {idx + 1}
                      </div>
                    </div>

                    {/* Logo */}
                    {product.bank.logoUrl ? (
                      <img
                        src={cleanLogoUrl(product.bank.logoUrl)}
                        alt={product.bank.name}
                        className="h-10 w-10 shrink-0 rounded-md object-contain"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--bankng-primary)]/10 text-sm font-bold text-[var(--bankng-primary)]">
                        {(product.bank.shortName ?? product.bank.name)[0]}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={bankLink}
                          className="text-sm font-medium text-[var(--bankng-primary)] hover:underline"
                        >
                          {product.bank.shortName ?? product.bank.name}
                        </Link>
                        {product.category && (
                          <span className="rounded-full bg-[var(--bankng-surface-muted)] px-2 py-0.5 text-xs text-[var(--bankng-text-secondary)]">
                            {product.category.name}
                          </span>
                        )}
                        {bestRate && (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                            {Number(bestRate.rateValue).toFixed(2)}%
                            {bestRate.termValue ? `/năm · ${bestRate.termValue} tháng` : "/năm"}
                          </span>
                        )}
                      </div>
                      <Link href={productLink} className="group mt-1 block">
                        <h3 className="font-semibold text-[var(--bankng-text-primary)] group-hover:text-[var(--bankng-primary)]">
                          {product.name}
                        </h3>
                      </Link>
                      {product.shortDescription && (
                        <p className="mt-1 line-clamp-2 text-sm text-[var(--bankng-text-secondary)]">
                          {product.shortDescription}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-3 text-xs text-[var(--bankng-text-secondary)]">
                        <span>Cập nhật {formatDate(product.updatedAt)}</span>
                        <Link
                          href={productLink}
                          className="text-[var(--bankng-primary)] hover:underline"
                        >
                          Xem chi tiết →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 rounded-xl border border-[var(--bankng-border)] bg-[var(--bankng-surface)] p-6 text-center">
          <p className="font-medium text-[var(--bankng-text-primary)]">
            Cần tư vấn sản phẩm phù hợp?
          </p>
          <p className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
            Kết nối với chuyên viên tư vấn ngân hàng được xác thực ngay hôm nay.
          </p>
          <Link
            href="/danh-sach-bankers"
            className="mt-4 inline-block rounded-lg bg-[var(--bankng-primary)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--bankng-primary)]/90"
          >
            Tìm chuyên viên tư vấn →
          </Link>
        </div>
      </section>
    </main>
  );
}
