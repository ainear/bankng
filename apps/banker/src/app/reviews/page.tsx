export const dynamic = "force-dynamic";

export default function ReviewsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--bankng-text-primary)]">Đánh giá của bạn</h1>
        <p className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
          Các đánh giá từ khách hàng đã được tư vấn.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--bankng-border)] bg-white py-20">
        <div className="text-5xl">⭐</div>
        <h2 className="mt-4 text-lg font-semibold text-[var(--bankng-text-primary)]">
          Tính năng đang phát triển
        </h2>
        <p className="mt-2 max-w-xs text-center text-sm text-[var(--bankng-text-secondary)]">
          Hệ thống đánh giá sẽ được bổ sung trong phiên bản tiếp theo. Đánh giá sẽ hiển thị tại đây sau khi khách hàng hoàn thành tư vấn.
        </p>
        <div className="mt-6 rounded-lg border border-[var(--bankng-border)] bg-[var(--bankng-surface-muted)] px-6 py-4 text-center">
          <div className="text-2xl font-bold text-[var(--bankng-text-primary)]">—</div>
          <div className="text-xs text-[var(--bankng-text-secondary)]">Điểm đánh giá trung bình</div>
        </div>
      </div>
    </div>
  );
}
