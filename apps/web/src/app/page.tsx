import Link from "next/link";
import { Button } from "@bankng/ui";
import { prisma } from "@bankng/db";
import { getRateMatrix } from "@/modules/public/rate-matrix";
import { RateTable } from "@/modules/public/components/rate-table";
import { BankTicker } from "@/components/bank-ticker";
import { HomepageLeadForm } from "@/modules/public/components/homepage-lead-form";

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
  const banks = await prisma.bank.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
    },
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 h-[300px] w-[300px] bg-emerald-500/5 rounded-full blur-3xl -z-10" />
        <div className="mx-auto max-w-6xl px-6 py-16 text-center md:text-left">
          <span className="rounded-full bg-emerald-100 text-emerald-800 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider">
            🚀 Nền tảng so sánh tài chính AI 2026
          </span>
          <h1 className="text-3.5xl font-black leading-tight md:text-5.5xl mt-5 tracking-tight">
            So sánh lãi suất, <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">chắp cánh tài chính</span>
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600 text-base md:text-lg font-semibold leading-relaxed mx-auto md:mx-0">
            Công cụ so sánh lãi suất tiết kiệm và vay ngân hàng tối ưu nhất Việt Nam.
            Dữ liệu được cào tự động hàng ngày, xác thực chính xác, bảo vệ quyền lợi người tiêu dùng.
          </p>

          {/* Category quick links */}
          <div className="mt-8 grid grid-cols-3 gap-4 md:grid-cols-6">
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-[var(--bankng-border)] bg-white p-5 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-500/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2.5xl transition-colors group-hover:bg-emerald-100">
                  {cat.emoji}
                </div>
                <span className="text-xs font-bold text-slate-700 transition-colors group-hover:text-emerald-700">{cat.label}</span>
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

      {/* Bottom CTA — Lead form tư vấn nhanh tương tác trực tiếp */}
      <HomepageLeadForm banks={banks} />
    </main>
  );
}