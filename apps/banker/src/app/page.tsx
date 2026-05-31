import { prisma } from "@bankng/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  try {
    const bankerEmail = process.env.BANKER_EMAIL ?? "banker@bankng.local";
    const user = await prisma.user.findUnique({
      where: { email: bankerEmail },
      include: {
        bankerProfile: {
          include: {
            bank: { select: { name: true, slug: true } },
          },
        },
      },
    });

    if (!user?.bankerProfile) {
      return { user, banker: null, leadStats: null, recentLeads: [] };
    }

    const [totalLeads, newLeads, contactedLeads, recentLeads] = await Promise.all([
      prisma.lead.count({ where: { assignedToId: user.id } }),
      prisma.lead.count({ where: { assignedToId: user.id, status: "new" } }),
      prisma.lead.count({ where: { assignedToId: user.id, status: "contacted" } }),
      prisma.lead.findMany({
        where: { assignedToId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          phone: true,
          status: true,
          createdAt: true,
          contextType: true,
        },
      }),
    ]);

    return {
      user,
      banker: user.bankerProfile,
      leadStats: { totalLeads, newLeads, contactedLeads },
      recentLeads,
    };
  } catch {
    return { user: null, banker: null, leadStats: null, recentLeads: [] };
  }
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "Mới", color: "bg-blue-100 text-blue-700" },
  contacted: { label: "Đã liên hệ", color: "bg-yellow-100 text-yellow-700" },
  qualified: { label: "Đã chốt", color: "bg-green-100 text-green-700" },
  closed: { label: "Đóng", color: "bg-gray-100 text-gray-600" },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function BankerHomePage() {
  const { user, banker, leadStats, recentLeads } = await getDashboardData();

  // Calculate dynamic verification checklist progress
  const checklist = {
    profile: !!(banker?.title && banker?.bio && banker?.phonePublic && banker?.specialties),
    bank: !!banker?.bankId,
    id: !!(banker?.idCardFront && banker?.idCardBack),
    badge: !!banker?.workBadge,
  };
  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = 4;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--bankng-text-primary)]">
          Xin chào{banker ? `, ${user?.email?.split("@")[0]}` : ""}! 👋
        </h1>
        <p className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
          {banker
            ? `${banker.title ?? "Nhân viên tư vấn"} tại ${banker.bank?.name ?? "Ngân hàng chưa liên kết"}`
            : "Chưa có hồ sơ banker. Hãy cập nhật hồ sơ để bắt đầu."}
        </p>
      </div>

      {/* Status banner */}
      {banker && (
        banker.isVerified ? (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 transition-all duration-300">
            <span className="text-xl">🛡️</span>
            <div>
              <p className="font-bold text-green-800">Tài khoản đã được xác thực</p>
              <p className="mt-0.5 text-sm text-green-700">
                Hồ sơ của bạn đã hoạt động công khai. Leads từ khách hàng có nhu cầu so sánh gói tài chính đang được phân phối tự động tới bạn.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 transition-all duration-300">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="font-bold text-yellow-800">Tài khoản chưa được xác minh</p>
              <p className="mt-0.5 text-sm text-yellow-700">
                Hồ sơ của bạn đang chờ phê duyệt ({completedCount}/{totalCount} bước hoàn tất). Hãy hoàn thành các bước tải lên tài liệu để kích hoạt tài khoản.{" "}
                <Link href="/verification" className="underline font-semibold text-yellow-800 hover:text-yellow-900">Xem tiến trình xác minh ({progressPct}%) →</Link>
              </p>
            </div>
          </div>
        )
      )}

      {/* Stats */}
      {leadStats && (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--bankng-border)] bg-white p-5">
            <div className="text-xs font-medium uppercase tracking-wide text-[var(--bankng-text-secondary)]">
              Tổng leads
            </div>
            <div className="mt-2 text-3xl font-bold text-[var(--bankng-text-primary)]">
              {leadStats.totalLeads}
            </div>
          </div>
          <div className="rounded-xl border border-[var(--bankng-border)] bg-white p-5">
            <div className="text-xs font-medium uppercase tracking-wide text-[var(--bankng-text-secondary)]">
              Leads mới
            </div>
            <div className="mt-2 text-3xl font-bold text-blue-600">
              {leadStats.newLeads}
            </div>
          </div>
          <div className="rounded-xl border border-[var(--bankng-border)] bg-white p-5">
            <div className="text-xs font-medium uppercase tracking-wide text-[var(--bankng-text-secondary)]">
              Đã liên hệ
            </div>
            <div className="mt-2 text-3xl font-bold text-yellow-600">
              {leadStats.contactedLeads}
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Cập nhật hồ sơ", href: "/profile", emoji: "👤", desc: "Ảnh, bio, chuyên môn" },
          { label: "Lead inbox", href: "/leads", emoji: "📬", desc: `${leadStats?.newLeads ?? 0} leads mới` },
          { label: "Xác minh", href: "/verification", emoji: "✅", desc: banker?.isVerified ? "Đã xác minh" : `Hoàn tất ${progressPct}%` },
          { label: "Đánh giá", href: "/reviews", emoji: "⭐", desc: `${banker?.reviewCount ?? 0} đánh giá` },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-3 rounded-xl border border-[var(--bankng-border)] bg-white p-4 transition-all hover:shadow-md hover:border-[var(--bankng-primary)]/50"
          >
            <span className="text-2xl">{action.emoji}</span>
            <div>
              <div className="text-sm font-semibold text-[var(--bankng-text-primary)]">{action.label}</div>
              <div className="text-xs text-[var(--bankng-text-secondary)]">{action.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent leads */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--bankng-text-primary)]">Leads gần đây</h2>
          <Link href="/leads" className="text-sm text-[var(--bankng-primary)] hover:underline">
            Xem tất cả →
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="rounded-xl border border-[var(--bankng-border)] bg-white p-8 text-center">
            <div className="text-3xl">📭</div>
            <p className="mt-2 text-sm text-[var(--bankng-text-secondary)]">
              Chưa có lead nào được phân công. Sau khi xác minh tài khoản thành công, leads từ khách hàng sẽ xuất hiện tại đây.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[var(--bankng-border)] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--bankng-border)] bg-[var(--bankng-surface-muted)]">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--bankng-text-secondary)]">Khách hàng</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--bankng-text-secondary)]">Loại</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--bankng-text-secondary)]">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--bankng-text-secondary)]">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bankng-border)]">
                {recentLeads.map((lead) => {
                  const status = STATUS_LABELS[lead.status] ?? { label: lead.status, color: "bg-gray-100 text-gray-600" };
                  return (
                    <tr key={lead.id} className="hover:bg-[var(--bankng-surface-muted)]">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[var(--bankng-text-primary)]">{lead.name}</div>
                        <div className="text-xs text-[var(--bankng-text-secondary)]">{lead.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-[var(--bankng-text-secondary)]">
                        {lead.contextType ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--bankng-text-secondary)]">
                        {formatDate(lead.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
