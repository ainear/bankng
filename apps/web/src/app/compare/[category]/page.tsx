import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Card } from "@bankng/ui";
import { getCompareCategory, getCompareCategories } from "@/modules/public/data";
import { EmptyState } from "@/modules/public/components/empty-state";
import { ProductCard } from "@/modules/public/components/product-card";
import { PublicBadge } from "@/modules/public/components/public-badge";
import { LeadCtaForm } from "@/modules/public/components/lead-cta-form";
import { getPublicFreshness } from "@/modules/public/freshness";
import { Breadcrumb } from "@/components/breadcrumb";

export async function generateStaticParams() {
  try {
    const categories = await getCompareCategories();
    return categories.map((cat) => ({ category: cat.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryData = await getCompareCategory(category);

  if (!categoryData) {
    return {
      title: "So sánh sản phẩm tài chính | Bankng",
      description: "So sánh sản phẩm tài chính giữa các ngân hàng lớn nhất Việt Nam. Cập nhật mới nhất, chính xác và minh bạch tại Bankng.vn."
    };
  }

  return {
    title: `So sánh ${categoryData.name} các Ngân hàng tốt nhất 2026 | Bankng`,
    description: `Bảng so sánh chi tiết ${categoryData.name} giữa 30+ ngân hàng Việt Nam. Cập nhật lãi suất mới nhất, kỳ hạn linh hoạt, điều kiện làm thủ tục hồ sơ nhanh chóng tại Bankng.vn.`,
    keywords: `so sánh ${categoryData.name}, lãi suất ${categoryData.name}, vay vốn, gửi tiết kiệm, ngân hàng tốt nhất Việt Nam`,
    openGraph: {
      title: `So sánh ${categoryData.name} các Ngân hàng | Bankng`,
      description: `Bảng so sánh chi tiết ${categoryData.name} giữa các ngân hàng. Cập nhật lãi suất và ưu đãi mới nhất tại Bankng.`,
      type: "website"
    }
  };
}

export default async function CompareCategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ bank?: string; term?: string; status?: string; sort?: string; feedback?: string }>;
}) {
  const { category: slug } = await params;
  const filters = searchParams ? await searchParams : undefined;
  const category = await getCompareCategory(slug);

  if (!category || !category.compareEnabled || !category.isActive) {
    notFound();
  }

  type Product = (typeof category.products)[number];

  const products = category.products
    .filter((product) => {
      const bankPass = !filters?.bank || product.bank.slug === filters.bank;
      const termPass =
        !filters?.term ||
        product.variants.some((v) => String(v.minTermMonth ?? "") === filters.term);
      const statusPass =
        !filters?.status ||
        product.variants.some((v) => v.rates.some((r) => r.status === filters.status));
      return bankPass && termPass && statusPass;
    })
    .sort((left: Product, right: Product) => {
      if (filters?.sort === "rate_desc") {
        const leftRate = Number(left.variants.flatMap((v) => v.rates)[0]?.rateValue ?? 0);
        const rightRate = Number(right.variants.flatMap((v) => v.rates)[0]?.rateValue ?? 0);
        return rightRate - leftRate;
      }
      if (filters?.sort === "bank_asc") {
        return left.bank.name.localeCompare(right.bank.name);
      }
      return left.name.localeCompare(right.name);
    });

  const bankOptions = Array.from(
    new Set(category.products.map((product) => product.bank.slug)),
  ).map((bankSlug) => {
    const bank = category.products.find((product) => product.bank.slug === bankSlug)?.bank;
    return { slug: bankSlug, name: bank?.name ?? bankSlug };
  });
  const termOptions = Array.from(
    new Set(
      category.products.flatMap((product) =>
        product.variants
          .map((variant) => variant.minTermMonth)
          .filter((value): value is number => typeof value === "number"),
      ),
    ),
  ).sort((a: number, b: number) => a - b);

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <div>
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "So sánh", href: "/compare" },
              { label: category.name }
            ]}
          />
          <h1 className="mt-4 text-3xl font-semibold">{category.name}</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--bankng-text-secondary)]">
            {category.description ?? "So sánh sản phẩm ngân hàng từ dữ liệu công khai hiện tại."}
          </p>
        </div>

        <Card className="sticky top-4 z-10" title="Bộ lọc">
          <form className="grid gap-4 md:grid-cols-5">
            <label className="grid gap-1 text-sm">
              <span>Ngân hàng</span>
              <select
                className="min-h-10 rounded-md border border-[var(--bankng-border)] bg-white px-3 py-2"
                defaultValue={filters?.bank ?? ""}
                name="bank"
              >
                <option value="">Tất cả ngân hàng</option>
                {bankOptions.map((bank) => (
                  <option key={bank.slug} value={bank.slug}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span>Kỳ hạn</span>
              <select
                className="min-h-10 rounded-md border border-[var(--bankng-border)] bg-white px-3 py-2"
                defaultValue={filters?.term ?? ""}
                name="term"
              >
                <option value="">Tất cả kỳ hạn</option>
                {termOptions.map((term) => (
                  <option key={term} value={term}>
                    {term} tháng
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span>Trạng thái</span>
              <select
                className="min-h-10 rounded-md border border-[var(--bankng-border)] bg-white px-3 py-2"
                defaultValue={filters?.status ?? ""}
                name="status"
              >
                <option value="">Tất cả</option>
                <option value="verified">Đã xác minh</option>
                <option value="pending">Chờ xác minh</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span>Sắp xếp</span>
              <select
                aria-label="Sắp xếp"
                className="min-h-10 rounded-md border border-[var(--bankng-border)] bg-white px-3 py-2"
                defaultValue={filters?.sort ?? ""}
                name="sort"
              >
                <option value="">Mặc định</option>
                <option value="bank_asc">Ngân hàng A-Z</option>
                <option value="rate_desc">Lãi suất cao → thấp</option>
              </select>
            </label>
            <div className="flex items-end gap-3">
              <Button type="submit">Lọc</Button>
              <Link className="text-sm text-[var(--bankng-primary)]" href={`/compare/${slug}`}>
                Đặt lại
              </Link>
            </div>
          </form>
        </Card>

        {filters?.feedback === "lead_created" ? (
          <div className="rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3">
            <div className="font-semibold">Đã ghi nhận yêu cầu</div>
            <div className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
              Yêu cầu của bạn đã được lưu. Đội ngũ sẽ liên hệ sớm nhất có thể.
            </div>
          </div>
        ) : filters?.feedback === "lead_duplicate" ? (
          <div className="rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3">
            <div className="font-semibold">Yêu cầu đã tồn tại</div>
            <div className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
              Bạn đã gửi yêu cầu cho danh mục này trong vòng 24 giờ qua.
            </div>
          </div>
        ) : null}

        <Card className="hidden md:block" title="Bảng so sánh">
          {products.length === 0 ? (
            <EmptyState
              description="Không có sản phẩm nào khớp với bộ lọc hiện tại."
              title="Không có kết quả"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--bankng-surface-muted)]">
                  <tr>
                    <th className="px-4 py-3">Sản phẩm</th>
                    <th className="px-4 py-3">Ngân hàng</th>
                    <th className="px-4 py-3">Gói</th>
                    <th className="px-4 py-3">Lãi suất tốt nhất</th>
                    <th className="px-4 py-3">Độ mới</th>
                    <th className="px-4 py-3">Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const topRate = product.variants.flatMap((variant) => variant.rates)[0];
                    const freshness = topRate
                      ? getPublicFreshness({
                          status: topRate.status,
                          effectiveFrom: topRate.effectiveFrom,
                          updatedAt: topRate.updatedAt,
                          now: new Date(),
                          reliabilityScore: topRate.source?.reliabilityScore ?? null
                        })
                      : null;

                    return (
                      <tr key={product.id}>
                        <td className="border-t border-[var(--bankng-border)] px-4 py-3">
                          {product.name}
                        </td>
                        <td className="border-t border-[var(--bankng-border)] px-4 py-3">
                          <Link
                            className="hover:text-[var(--bankng-primary)] hover:underline"
                            href={`/bank/${product.bank.slug}`}
                          >
                            {product.bank.name}
                          </Link>
                        </td>
                        <td className="border-t border-[var(--bankng-border)] px-4 py-3">
                          {product.variants.map((variant) => variant.variantName).join(", ")}
                        </td>
                        <td className="border-t border-[var(--bankng-border)] px-4 py-3 font-semibold text-[var(--bankng-rate-highlight)]">
                          {topRate ? `${topRate.rateValue.toString()} ${topRate.rateUnit}` : "—"}
                        </td>
                        <td className="border-t border-[var(--bankng-border)] px-4 py-3">
                          {freshness ? (
                            <PublicBadge tone={freshness.tone}>{String(freshness.label)}</PublicBadge>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="border-t border-[var(--bankng-border)] px-4 py-3">
                          <Link className="text-[var(--bankng-primary)] hover:underline" href={`/product/${product.slug}`}>
                            Xem chi tiết
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="md:hidden" title="Danh sách sản phẩm (mobile)">
          <div className="grid gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  slug: product.slug,
                  name: product.name,
                  shortDescription: product.shortDescription,
                  bank: {
                    slug: product.bank.slug,
                    name: product.bank.name
                  },
                  variants: product.variants.map((variant) => ({
                    rates: variant.rates
                  }))
                }}
              />
            ))}
          </div>
        </Card>

        <Card title="Nguồn dữ liệu & cảnh báo">
          <div className="grid gap-2 text-sm text-[var(--bankng-text-secondary)]">
            <p>Dữ liệu được lấy từ catalog/rates hiện có trong hệ thống và không thay thế tư vấn tài chính cá nhân.</p>
            <p>Lãi suất công khai cần được đối chiếu với nguồn chính thức trước khi ra quyết định.</p>
            <p>Trang này ưu tiên hiển thị nguồn, độ mới và trạng thái xác minh để tăng độ tin cậy.</p>
          </div>
        </Card>

        <LeadCtaForm
          contextSlug={slug}
          contextType="category"
          description="Cần được tư vấn nhanh về danh mục này? Để lại thông tin để đội ngũ tiếp nhận."
          sourcePage={`/compare/${slug}`}
          title="Nhận tư vấn miễn phí"
        />


      </section>
    </main>
  );
}
