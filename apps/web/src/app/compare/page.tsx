import Link from "next/link";
import type { Metadata } from "next";
import { getCompareCategories } from "@/modules/public/data";
import { Breadcrumb } from "@/components/breadcrumb";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "So sánh sản phẩm ngân hàng | Bankng",
  description:
    "So sánh lãi suất, phí và điều kiện các sản phẩm ngân hàng: vay mua nhà, vay mua xe, tiết kiệm, thẻ tín dụng, và nhiều hơn nữa."
};

const CATEGORY_ICONS: Record<string, string> = {
  "vay-mua-nha": "🏠",
  "vay-mua-xe": "🚗",
  "vay-tin-chap": "💳",
  "the-tin-dung": "💳",
  "tiet-kiem": "💰",
  "vay-kinh-doanh": "🏢"
};

export default async function CompareIndexPage() {
  let categories: any = [];
  try {
    categories = await getCompareCategories();
  } catch {
    // DB unavailable at build time — page will load via ISR at runtime
  }

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <div>
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "So sánh" }
            ]}
          />
          <h1 className="mt-4 text-3xl font-bold">So sánh sản phẩm ngân hàng</h1>
          <p className="mt-2 max-w-2xl text-[var(--bankng-text-secondary)]">
            Chọn danh mục sản phẩm để xem bảng so sánh lãi suất và điều kiện từ nhiều ngân hàng.
            Dữ liệu được cập nhật thường xuyên từ nguồn chính thức.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-lg border border-[var(--bankng-border)] bg-white p-10 text-center">
            <p className="text-[var(--bankng-text-secondary)]">
              Chưa có danh mục so sánh nào được kích hoạt.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/compare/${category.slug}`}
                className="group flex flex-col gap-3 rounded-xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm transition-all hover:border-[var(--bankng-primary)] hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {CATEGORY_ICONS[category.slug] ?? "📊"}
                  </span>
                  <div>
                    <h2 className="font-semibold text-[var(--bankng-text-primary)] group-hover:text-[var(--bankng-primary)]">
                      {category.name}
                    </h2>
                    <p className="text-xs text-[var(--bankng-text-secondary)]">
                      {category._count.products} sản phẩm
                    </p>
                  </div>
                </div>
                {category.description && (
                  <p className="text-sm text-[var(--bankng-text-secondary)] line-clamp-2">
                    {category.description}
                  </p>
                )}
                <div className="mt-auto flex items-center gap-1 text-sm font-medium text-[var(--bankng-primary)]">
                  Xem so sánh
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="rounded-lg border border-[var(--bankng-border)] bg-[var(--bankng-surface)] p-4 text-sm text-[var(--bankng-text-secondary)]">
          <strong className="text-[var(--bankng-text-primary)]">Lưu ý:</strong> Dữ liệu lãi suất
          mang tính tham khảo. Vui lòng đối chiếu với nguồn chính thức của ngân hàng trước khi
          ra quyết định tài chính.
        </div>
      </section>
    </main>
  );
}
