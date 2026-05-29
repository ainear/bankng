import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Không tìm thấy trang | Bankng",
  description: "Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--bankng-background)] px-6 text-[var(--bankng-text-primary)]">
      <div className="w-full max-w-md text-center">
        {/* Large 404 */}
        <div className="relative mb-6 flex items-center justify-center">
          <span className="text-[10rem] font-black leading-none text-[var(--bankng-primary)]/10 select-none">
            404
          </span>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl">🏦</div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[var(--bankng-text-primary)]">
          Trang không tìm thấy
        </h1>
        <p className="mt-3 text-[var(--bankng-text-secondary)]">
          Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển. Hãy thử tìm lại từ trang chủ.
        </p>

        {/* Quick links */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--bankng-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--bankng-primary)]/90"
          >
            ← Về trang chủ
          </Link>
          <Link
            href="/compare"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--bankng-border)] px-6 py-3 text-sm font-semibold text-[var(--bankng-text-primary)] transition-colors hover:bg-[var(--bankng-surface-muted)]"
          >
            So sánh lãi suất
          </Link>
        </div>

        {/* Popular links */}
        <div className="mt-10 rounded-xl border border-[var(--bankng-border)] bg-white p-5">
          <p className="mb-3 text-sm font-medium text-[var(--bankng-text-secondary)]">
            Các trang phổ biến
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link
              href="/compare/tiet-kiem"
              className="rounded-lg px-3 py-2 text-[var(--bankng-primary)] hover:bg-[var(--bankng-surface-muted)]"
            >
              Lãi suất tiết kiệm
            </Link>
            <Link
              href="/compare/vay-mua-nha"
              className="rounded-lg px-3 py-2 text-[var(--bankng-primary)] hover:bg-[var(--bankng-surface-muted)]"
            >
              Vay mua nhà
            </Link>
            <Link
              href="/danh-sach-bankers"
              className="rounded-lg px-3 py-2 text-[var(--bankng-primary)] hover:bg-[var(--bankng-surface-muted)]"
            >
              Chuyên viên tư vấn
            </Link>
            <Link
              href="/tin-tuc"
              className="rounded-lg px-3 py-2 text-[var(--bankng-primary)] hover:bg-[var(--bankng-surface-muted)]"
            >
              Tin tức tài chính
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
