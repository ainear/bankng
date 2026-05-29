import Link from "next/link";

export const dynamic = "force-dynamic";

const TOOLS = [
  {
    title: "Tính lãi vay mua nhà",
    description: "Tính toán chi phí vay mua nhà, số tiền trả hàng tháng và tổng lãi phải trả.",
    href: "/danh-gia-nhanh/vay-mua-nha",
    emoji: "🏠",
    category: "Vay",
  },
  {
    title: "Tính lãi vay mua xe",
    description: "Tính toán chi phí vay mua xe ô tô, xe máy với các gói vay linh hoạt.",
    href: "/danh-gia-nhanh/vay-mua-xe",
    emoji: "🚗",
    category: "Vay",
  },
  {
    title: "Tính lãi vay tín chấp",
    description: "Tính toán chi phí vay tín chấp cá nhân, không cần tài sản đảm bảo.",
    href: "/danh-gia-nhanh/vay-tin-chap",
    emoji: "💳",
    category: "Vay",
  },
  {
    title: "Tính lãi vay kinh doanh",
    description: "Tính toán chi phí vay vốn lưu động hoặc đầu tư cho doanh nghiệp.",
    href: "/danh-gia-nhanh/vay-kinh-doanh",
    emoji: "🏢",
    category: "Vay",
  },
  {
    title: "Tính lãi tiết kiệm",
    description: "Tính toán số tiền lãi nhận được khi gửi tiết kiệm, so sánh với lãi suất thị trường.",
    href: "/danh-gia-nhanh/tiet-kiem",
    emoji: "💰",
    category: "Gửi",
  },
];

export default function FinancialToolsPage() {
  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Công cụ tài chính</h1>
          <p className="mt-2 text-[var(--bankng-text-secondary)]">
            Các công cụ tính toán lãi suất, so sánh sản phẩm ngân hàng.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group block rounded-lg border border-[var(--bankng-border)] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{tool.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[var(--bankng-surface-muted)] px-2 py-0.5 text-xs text-[var(--bankng-text-secondary)]">
                      {tool.category}
                    </span>
                  </div>
                  <h3 className="mt-2 font-semibold text-[var(--bankng-text-primary)] group-hover:text-[var(--bankng-primary)]">
                    {tool.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
                    {tool.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Rate comparison */}
        <div className="mt-12 rounded-lg border border-[var(--bankng-border)] bg-[var(--bankng-surface)] p-6">
          <h2 className="text-lg font-semibold">So sánh lãi suất ngân hàng</h2>
          <p className="mt-2 text-sm text-[var(--bankng-text-secondary)]">
            Xem bảng lãi suất tiết kiệm từ {">"} 50 ngân hàng Việt Nam, cập nhật hàng ngày.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-[var(--bankng-primary)] hover:underline"
          >
            Xem bảng lãi suất →
          </Link>
        </div>
      </section>
    </main>
  );
}
