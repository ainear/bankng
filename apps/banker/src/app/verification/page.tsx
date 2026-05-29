import { prisma } from "@bankng/db";

export const dynamic = "force-dynamic";

async function getVerificationStatus() {
  try {
    const bankerEmail = process.env.BANKER_EMAIL ?? "banker@bankng.local";
    const user = await prisma.user.findUnique({
      where: { email: bankerEmail },
      include: {
        bankerProfile: {
          include: {
            bank: { select: { name: true } },
          },
        },
      },
    });
    return user;
  } catch {
    return null;
  }
}

const CHECKLIST = [
  {
    key: "profile",
    label: "Hoàn thiện hồ sơ",
    desc: "Chức danh, bio, khu vực hoạt động",
    href: "/profile",
  },
  {
    key: "bank",
    label: "Liên kết ngân hàng",
    desc: "Xác nhận bạn đang làm việc tại ngân hàng nào",
    href: "/profile",
  },
  {
    key: "id",
    label: "Xác minh CCCD",
    desc: "Tải lên ảnh CCCD mặt trước và sau",
    href: "#",
  },
  {
    key: "badge",
    label: "Thẻ nhân viên",
    desc: "Ảnh thẻ nhân viên có logo ngân hàng",
    href: "#",
  },
];

export default async function VerificationPage() {
  const user = await getVerificationStatus();
  const banker = user?.bankerProfile;

  const checklistStatus = {
    profile: !!(banker?.title && banker?.bio),
    bank: !!banker?.bankId,
    id: false, // not implemented yet
    badge: false, // not implemented yet
  };

  const completedCount = Object.values(checklistStatus).filter(Boolean).length;
  const totalCount = CHECKLIST.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--bankng-text-primary)]">Xác minh tài khoản</h1>
        <p className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
          Hoàn thành các bước xác minh để nhận leads và hiển thị badge &ldquo;Đã xác thực&rdquo;.
        </p>
      </div>

      {/* Status banner */}
      <div
        className={`mb-8 flex items-center gap-4 rounded-xl p-5 ${
          banker?.isVerified
            ? "bg-green-50 border border-green-200"
            : "bg-yellow-50 border border-yellow-200"
        }`}
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl ${
            banker?.isVerified ? "bg-green-100" : "bg-yellow-100"
          }`}
        >
          {banker?.isVerified ? "✅" : "⏳"}
        </div>
        <div>
          <div className={`font-semibold ${banker?.isVerified ? "text-green-800" : "text-yellow-800"}`}>
            {banker?.isVerified ? "Tài khoản đã được xác minh" : "Đang chờ xác minh"}
          </div>
          <div className={`mt-0.5 text-sm ${banker?.isVerified ? "text-green-700" : "text-yellow-700"}`}>
            {banker?.isVerified
              ? "Hồ sơ của bạn đã được phê duyệt. Bạn sẽ nhận được leads từ hệ thống."
              : "Vui lòng hoàn thành các bước bên dưới và chờ admin phê duyệt (1-3 ngày làm việc)."}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-[var(--bankng-text-primary)]">Tiến trình xác minh</span>
          <span className="text-[var(--bankng-text-secondary)]">{completedCount}/{totalCount} bước hoàn thành</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[var(--bankng-primary)] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {CHECKLIST.map((step) => {
          const done = checklistStatus[step.key as keyof typeof checklistStatus];
          return (
            <div
              key={step.key}
              className={`flex items-center gap-4 rounded-xl border p-4 ${
                done
                  ? "border-green-200 bg-green-50"
                  : "border-[var(--bankng-border)] bg-white"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  done ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? "✓" : "○"}
              </div>
              <div className="flex-1">
                <div className={`font-medium ${done ? "text-green-800" : "text-[var(--bankng-text-primary)]"}`}>
                  {step.label}
                </div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">{step.desc}</div>
              </div>
              {!done && (
                <a
                  href={step.href}
                  className="shrink-0 rounded-lg border border-[var(--bankng-border)] px-3 py-1.5 text-xs font-medium text-[var(--bankng-text-primary)] hover:bg-[var(--bankng-surface-muted)]"
                >
                  Thực hiện →
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="mt-8 rounded-xl border border-[var(--bankng-border)] bg-[var(--bankng-surface-muted)] p-5">
        <h3 className="font-semibold text-[var(--bankng-text-primary)]">Lưu ý quan trọng</h3>
        <ul className="mt-2 space-y-1 text-sm text-[var(--bankng-text-secondary)]">
          <li>• Quá trình xét duyệt mất 1-3 ngày làm việc</li>
          <li>• Thông tin phải chính xác và trùng khớp với hồ sơ ngân hàng</li>
          <li>• Bankng có quyền từ chối nếu phát hiện thông tin không hợp lệ</li>
          <li>• Liên hệ hỗ trợ: support@bankng.com nếu cần giải đáp</li>
        </ul>
      </div>
    </div>
  );
}
