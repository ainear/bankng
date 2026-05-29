import Link from "next/link";
import { Button } from "@bankng/ui";
import { getRateMatrix } from "@/modules/public/rate-matrix";
import { RateTable } from "@/modules/public/components/rate-table";
import { BankTicker } from "@/components/bank-ticker";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PRODUCT_CATEGORIES = [
  {
    label: "Vay mua nhà",
    href: "/compare/vay-mua-nha",
    emoji: "🏠"
  },
  {
    label: "Vay mua xe",
    href: "/compare/vay-mua-xe",
    emoji: "🚗"
  },
  {
    label: "Vay tín chấp",
    href: "/compare/vay-tin-chap",
    emoji: "💳"
  },
  {
    label: "Vay kinh doanh",
    href: "/compare/vay-kinh-doanh",
    emoji: "🏢"
  },
  {
    label: "Thẻ tín dụng",
    href: "/compare/the-tin-dung",
    emoji: "💳"
  },
  {
    label: "Gửi tiết kiệm",
    href: "/compare/tiet-kiem",
    emoji: "💰"
  }
];

export default async function HomePage() {
  const { rows, terms } = await getRateMatrix();

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--bankng-primary)]/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            So sánh lãi suất, chắp cánh tài chính
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--bankng-text-secondary)]">
            Công cụ so sánh lãi suất tiết kiệm và vay ngân hàng tốt nhất Việt Nam.
            Dữ liệu được cập nhật hàng ngày, nguồn chính thức, chi tiết.
          </p>

          {/* Category quick links */}
          <div className="mt-8 grid grid-cols-3 gap-3 md:grid-cols-6">
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="flex flex-col items-center gap-2 rounded-lg border border-[var(--bankng-border)] bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-medium">{cat.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-4">
            <Link
              href="/compare"
              className="text-sm font-medium text-[var(--bankng-primary)] hover:underline"
            >
              Xem tất cả danh mục so sánh →
            </Link>
          </div>
        </div>
      </section>

      {/* Bank ticker — logo ngân hàng scrolling */}
      <BankTicker />

      {/* Rate matrix */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Bảng lãi suất tiết kiệm</h2>
            <p className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
              {rows.length} ngân hàng | Cập nhật hôm nay
            </p>
          </div>
          <Link href="/compare/tiet-kiem">
            <Button variant="secondary">Công cụ tính lãi</Button>
          </Link>
        </div>

        <RateTable rows={rows} terms={terms} />
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-lg border border-[var(--bankng-border)] bg-[var(--bankng-surface)] p-6 text-center">
          <h3 className="text-lg font-semibold">Cần tư vấn nhanh?</h3>
          <p className="mt-2 text-sm text-[var(--bankng-text-secondary)]">
            Để lại thông tin, nhân viên ngân hàng sẽ liên hệ bạn trong 24 giờ.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/danh-sach-bankers">
              <Button>Xem danh sách nhân viên</Button>
            </Link>
            <Link href="/tin-tuc">
              <Button variant="ghost">Đọc bài viết</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}