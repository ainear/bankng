import { prisma } from "@bankng/db";
import { Prisma } from "@bankng/db";
import { updateBankerLeadStatusAction, claimBankerLeadAction } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  new:        { label: "Mới",        bg: "bg-blue-100",   text: "text-blue-700"   },
  contacted:  { label: "Đã liên hệ", bg: "bg-yellow-100", text: "text-yellow-700" },
  qualified:  { label: "Tiềm năng",  bg: "bg-green-100",  text: "text-green-700"  },
  closed:     { label: "Đóng",       bg: "bg-gray-100",   text: "text-gray-600"   },
};

const CONTEXT_LABELS: Record<string, string> = {
  "banker":  "Tư vấn viên",
  "product": "Sản phẩm",
  "compare": "So sánh",
  "tool":    "Công cụ tính",
  "general": "Tổng hợp",
};

const PROVINCES_MAP: Record<string, string> = {
  HN: "Hà Nội",
  HCM: "TP. Hồ Chí Minh",
  DN: "Đà Nẵng",
  CT: "Cần Thơ",
  HP: "Hải Phòng",
  BR: "Bình Dương",
  DNI: "Đồng Nai",
};

const PROVINCES_LIST = [
  { value: "HN", label: "Hà Nội" },
  { value: "HCM", label: "TP. Hồ Chí Minh" },
  { value: "DN", label: "Đà Nẵng" },
  { value: "CT", label: "Cần Thơ" },
  { value: "HP", label: "Hải Phòng" },
  { value: "BR", label: "Bình Dương" },
  { value: "DNI", label: "Đồng Nai" },
];

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(d);
}

type LeadWithHistory = Prisma.LeadGetPayload<{
  include: {
    history: {
      orderBy: { createdAt: "desc" };
      take: 3;
      include: { actor: { select: { email: true } } };
    };
  };
}>;

export default async function BankerLeadsPage({
  searchParams,
}: {
  searchParams?: Promise<{ feedback?: string; status?: string; tab?: string; province?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const bankerEmail = process.env.BANKER_EMAIL ?? "banker@bankng.local";
  const activeTab = params.tab ?? "my-leads";
  const activeProvince = params.province ?? "all";
  const activeStatus = params.status ?? "all";

  let leads: LeadWithHistory[] = [];
  let marketplaceLeads: LeadWithHistory[] = [];
  let banker = null;
  let bankerProvinceCode: string | null = null;

  try {
    banker = await prisma.user.findUnique({
      where: { email: bankerEmail },
      select: {
        id: true,
        email: true,
        bankerProfile: {
          select: {
            provinceCode: true,
          },
        },
      },
    });

    if (banker) {
      bankerProvinceCode = banker.bankerProfile?.provinceCode || null;

      // 1. Fetch Banker's assigned leads
      const statusFilter = activeStatus !== "all" ? { status: activeStatus } : {};
      leads = await prisma.lead.findMany({
        where: { assignedToId: banker.id, ...statusFilter },
        orderBy: { createdAt: "desc" },
        include: {
          history: {
            orderBy: { createdAt: "desc" },
            take: 3,
            include: { actor: { select: { email: true } } },
          },
        },
      });

      // 2. Fetch Marketplace leads (unassigned, status = new)
      const provinceFilter = activeProvince !== "all" ? { provinceCode: activeProvince } : {};
      marketplaceLeads = await prisma.lead.findMany({
        where: {
          assignedToId: null,
          status: "new",
          ...provinceFilter,
        },
        orderBy: { createdAt: "desc" },
        include: {
          history: {
            orderBy: { createdAt: "desc" },
            take: 3,
            include: { actor: { select: { email: true } } },
          },
        },
      });
    }
  } catch (error) {
    console.error("Database connection error in BankerLeadsPage:", error);
  }

  // Count leads for stats badges
  const myLeadsCount = leads.length;
  const marketplaceCount = marketplaceLeads.length;

  const myLeadsByStatus = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    closed: leads.filter((l) => l.status === "closed").length,
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--bankng-text-primary)]">Hộp thư Leads khách hàng</h1>
          <p className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
            Quản lý khách hàng của bạn và chủ động tìm kiếm các cơ hội tư vấn tiềm năng trên sàn.
          </p>
        </div>
        {bankerProvinceCode && (
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            📍 Địa bàn hoạt động: {PROVINCES_MAP[bankerProvinceCode] ?? bankerProvinceCode}
          </div>
        )}
      </div>

      {/* Feedbacks */}
      {params.feedback === "lead_updated" && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          ✓ Đã cập nhật trạng thái Lead thành công.
        </div>
      )}
      {params.feedback === "lead_claimed" && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          🎉 Nhận tư vấn thành công! Lead này đã được chuyển vào mục "Khách hàng của tôi".
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <div className="mb-6 border-b border-[var(--bankng-border)]">
        <div className="flex gap-6">
          <a
            href={`/leads?tab=my-leads`}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === "my-leads"
                ? "border-[var(--bankng-primary)] text-[var(--bankng-primary)]"
                : "border-transparent text-[var(--bankng-text-secondary)] hover:text-[var(--bankng-text-primary)]"
            }`}
          >
            Khách hàng của tôi
            <span className="ml-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 font-medium">
              {myLeadsCount}
            </span>
          </a>
          <a
            href={`/leads?tab=marketplace`}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === "marketplace"
                ? "border-[var(--bankng-primary)] text-[var(--bankng-primary)]"
                : "border-transparent text-[var(--bankng-text-secondary)] hover:text-[var(--bankng-text-primary)]"
            }`}
          >
            Sàn nhận Leads (Chờ nhận)
            <span className="ml-1.5 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600 font-semibold animate-pulse">
              {marketplaceCount}
            </span>
          </a>
        </div>
      </div>

      {/* Tab Contents: Banker's Assigned Leads */}
      {activeTab === "my-leads" && (
        <div>
          {/* Status filter tabs for My Leads */}
          <div className="mb-6 flex flex-wrap gap-2">
            {(["all", "new", "contacted", "qualified", "closed"] as const).map((s) => {
              const cfg = s === "all"
                ? { label: "Tất cả", bg: "bg-gray-100", text: "text-gray-700" }
                : STATUS_CONFIG[s];
              const isActive = activeStatus === s;
              return (
                <a
                  key={s}
                  href={`/leads?tab=my-leads${s !== "all" ? `&status=${s}` : ""}`}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? `${cfg.bg} ${cfg.text} ring-1 ring-current`
                      : "bg-white border border-[var(--bankng-border)] text-[var(--bankng-text-secondary)] hover:bg-[var(--bankng-surface-muted)]"
                  }`}
                >
                  {cfg.label}
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${isActive ? "bg-white/50" : "bg-gray-100"}`}>
                    {myLeadsByStatus[s]}
                  </span>
                </a>
              );
            })}
          </div>

          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--bankng-border)] bg-white py-16">
              <div className="text-4xl">📭</div>
              <p className="mt-3 font-medium text-[var(--bankng-text-primary)]">Chưa có lead nào được gán</p>
              <p className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
                {activeStatus !== "all"
                  ? "Không có lead ở trạng thái này."
                  : "Chưa có lead nào được phân phối cho bạn hoặc bạn chưa nhận lead từ sàn."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead) => {
                const sc = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG.closed;
                return (
                  <div key={lead.id} className="rounded-xl border border-[var(--bankng-border)] bg-white p-5 transition-shadow hover:shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-[var(--bankng-text-primary)] text-base">{lead.name}</h3>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${sc.bg} ${sc.text}`}>
                            {sc.label}
                          </span>
                          {lead.provinceCode && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                              📍 {PROVINCES_MAP[lead.provinceCode] ?? lead.provinceCode}
                            </span>
                          )}
                        </div>
                        <div className="mt-3 space-y-1.5 text-sm text-[var(--bankng-text-secondary)]">
                          <div className="flex items-center gap-2 text-[var(--bankng-text-primary)] font-medium">
                            <span>📞 SĐT:</span>
                            <a href={`tel:${lead.phone}`} className="hover:underline text-[var(--bankng-primary)]">{lead.phone}</a>
                          </div>
                          {lead.email && (
                            <div className="flex items-center gap-2">
                              <span>✉️ Email:</span>
                              <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                            </div>
                          )}
                          {lead.message && (
                            <div className="rounded-lg bg-gray-50 p-3 text-xs italic text-[var(--bankng-text-primary)] border-l-2 border-gray-300">
                              💬 {lead.message}
                            </div>
                          )}
                          <div className="text-xs pt-1 flex flex-wrap gap-x-3 gap-y-1 border-t border-gray-100 mt-2">
                            <span>Nguồn: <strong>{CONTEXT_LABELS[lead.contextType ?? ""] ?? lead.contextType ?? "—"}</strong></span>
                            {lead.contextSlug && <span>Đường dẫn: <code className="bg-gray-50 px-1 py-0.5 rounded text-gray-600 text-[10px]">{lead.contextSlug}</code></span>}
                            <span>Thời gian tạo: {formatDate(lead.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <form action={updateBankerLeadStatusAction} className="flex shrink-0 flex-col gap-2 sm:w-52">
                        <input name="id" type="hidden" value={lead.id} />
                        <label className="text-xs font-medium text-gray-500">Trạng thái chăm sóc:</label>
                        <select
                          className="rounded-lg border border-[var(--bankng-border)] bg-white px-3 py-2 text-sm focus:border-[var(--bankng-primary)] focus:outline-none"
                          defaultValue={lead.status}
                          name="status"
                        >
                          <option value="new">Mới</option>
                          <option value="contacted">Đã liên hệ</option>
                          <option value="qualified">Tiềm năng (Đã chốt)</option>
                          <option value="closed">Đóng / Hủy bỏ</option>
                        </select>
                        <input
                          className="rounded-lg border border-[var(--bankng-border)] px-3 py-2 text-sm focus:border-[var(--bankng-primary)] focus:outline-none"
                          defaultValue={lead.message ?? ""}
                          name="note"
                          placeholder="Cập nhật ghi chú chăm sóc..."
                        />
                        <button
                          type="submit"
                          className="rounded-lg bg-[var(--bankng-primary)] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--bankng-primary)]/90"
                        >
                          Lưu cập nhật
                        </button>
                      </form>
                    </div>

                    {lead.history.length > 0 && (
                      <div className="mt-4 border-t border-[var(--bankng-border)] pt-3">
                        <div className="text-xs font-semibold text-[var(--bankng-text-secondary)] mb-1.5">Lịch sử cập nhật chăm sóc:</div>
                        <div className="space-y-1">
                          {lead.history.map((item) => (
                            <div key={item.id} className="text-xs text-[var(--bankng-text-secondary)] flex items-center gap-1.5">
                              <span className="text-gray-400">{formatDate(item.createdAt)}:</span>
                              <span className="font-medium text-gray-600">{STATUS_CONFIG[item.fromStatus ?? ""]?.label ?? "Bắt đầu"}</span>
                              <span className="text-gray-400">→</span>
                              <span className="font-semibold text-gray-800">{STATUS_CONFIG[item.toStatus]?.label ?? item.toStatus}</span>
                              {item.note && <span className="italic text-gray-500">({item.note})</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Contents: Sàn nhận Leads (Marketplace) */}
      {activeTab === "marketplace" && (
        <div>
          {/* Geographic Filter dropdown */}
          <div className="mb-6 flex flex-col justify-between gap-4 rounded-xl border border-[var(--bankng-border)] bg-gray-50 p-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-[var(--bankng-text-primary)]">Lọc theo khu vực:</span>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`/leads?tab=marketplace&province=all`}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all ${
                    activeProvince === "all"
                      ? "bg-[var(--bankng-primary)] border-[var(--bankng-primary)] text-white shadow-sm"
                      : "bg-white border-[var(--bankng-border)] text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Tất cả khu vực
                </a>
                {PROVINCES_LIST.map((prov) => (
                  <a
                    key={prov.value}
                    href={`/leads?tab=marketplace&province=${prov.value}`}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all ${
                      activeProvince === prov.value
                        ? "bg-[var(--bankng-primary)] border-[var(--bankng-primary)] text-white shadow-sm"
                        : "bg-white border-[var(--bankng-border)] text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {prov.label}
                  </a>
                ))}
              </div>
            </div>
            {bankerProvinceCode && (
              <a
                href={`/leads?tab=marketplace&province=${bankerProvinceCode}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 hover:bg-orange-100"
              >
                📍 Lọc nhanh tỉnh của tôi ({PROVINCES_MAP[bankerProvinceCode]})
              </a>
            )}
          </div>

          {marketplaceLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--bankng-border)] bg-white py-16">
              <div className="text-4xl">🏜️</div>
              <p className="mt-3 font-medium text-[var(--bankng-text-primary)]">Sàn Leads hiện tại chưa có yêu cầu mới</p>
              <p className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
                {activeProvince !== "all"
                  ? `Không tìm thấy yêu cầu tư vấn nào tại tỉnh ${PROVINCES_MAP[activeProvince]}.`
                  : "Toàn bộ Leads mới đã được các Bankers khác nhận tư vấn."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50 text-red-800 text-xs px-4 py-3 rounded-lg border border-red-100 font-medium animate-pulse">
                🔥 MẸO KINH DOANH: Nhận các Leads đúng khu vực của bạn sẽ giúp tăng tỷ lệ chốt deal lên hơn 85%! Hãy đăng ký gói **Bankng Premium** để không bỏ lỡ các leads chất lượng cao.
              </div>

              {marketplaceLeads.map((lead) => {
                const isLocal = bankerProvinceCode && lead.provinceCode === bankerProvinceCode;
                return (
                  <div
                    key={lead.id}
                    className={`rounded-xl border p-5 transition-all bg-white hover:shadow-md ${
                      isLocal ? "border-orange-300 ring-1 ring-orange-200/50 bg-orange-50/10" : "border-[var(--bankng-border)]"
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-[var(--bankng-text-primary)] text-base">{lead.name.replace(/(?<=.).(?=.)/g, "*")} (Ẩn)</h3>
                          {lead.provinceCode && (
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              isLocal ? "bg-orange-100 text-orange-800" : "bg-slate-100 text-slate-700"
                            }`}>
                              📍 {PROVINCES_MAP[lead.provinceCode] ?? lead.provinceCode}
                            </span>
                          )}
                          {isLocal && (
                            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700 flex items-center gap-1 animate-bounce">
                              📌 Gần bạn
                            </span>
                          )}
                        </div>
                        <div className="mt-3 space-y-2 text-sm text-[var(--bankng-text-secondary)]">
                          <div className="text-[var(--bankng-text-primary)] font-medium">
                            📞 SĐT: <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs">Chưa công khai (Nhận lead để xem)</span>
                          </div>
                          {lead.message && (
                            <div className="rounded-lg bg-gray-50 p-3 text-xs italic text-[var(--bankng-text-primary)] border-l-2 border-gray-300">
                              💬 Nhu cầu: {lead.message}
                            </div>
                          )}
                          <div className="text-xs pt-1 flex flex-wrap gap-x-3 gap-y-1 border-t border-gray-100 mt-2">
                            <span>Sản phẩm quan tâm: <strong>{CONTEXT_LABELS[lead.contextType ?? ""] ?? lead.contextType ?? "—"}</strong></span>
                            {lead.contextSlug && <span>Chi tiết: <code className="bg-gray-50 px-1 py-0.5 rounded text-gray-600 text-[10px]">{lead.contextSlug}</code></span>}
                            <span>Tạo lúc: {formatDate(lead.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col gap-2 sm:w-52">
                        <form action={claimBankerLeadAction}>
                          <input name="id" type="hidden" value={lead.id} />
                          <button
                            type="submit"
                            className={`w-full rounded-lg px-4 py-3 text-sm font-semibold text-white transition-all shadow-sm flex items-center justify-center gap-1 ${
                              isLocal
                                ? "bg-orange-500 hover:bg-orange-600"
                                : "bg-[var(--bankng-primary)] hover:bg-[var(--bankng-primary)]/90"
                            }`}
                          >
                            🤝 Nhận tư vấn ngay
                          </button>
                        </form>
                        <div className="text-[10px] text-center text-gray-500 italic">
                          Số điện thoại và thông tin liên hệ sẽ xuất hiện ngay sau khi bạn nhận Lead thành công.
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
