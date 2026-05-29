import { prisma } from "@bankng/db";
import {
  AdminPage,
  DataTable,
  SectionCard,
  TableCell,
} from "../shared/page-ui";
import { approveRegistrationAction, rejectRegistrationAction } from "./actions";
import { resolveFeedback } from "../shared/server/feedback";

export const dynamic = "force-dynamic";

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  pending:  { label: "Chờ duyệt",  className: "bg-amber-100 text-amber-700" },
  approved: { label: "Đã duyệt",   className: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Đã từ chối", className: "bg-red-100 text-red-600" },
};

export default async function BankerRegistrationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ feedback?: string; status?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const statusFilter = params?.status ?? "pending";

  const [registrations, counts] = await Promise.all([
    prisma.bankerRegistration.findMany({
      where: statusFilter !== "all" ? { status: statusFilter } : undefined,
      orderBy: { createdAt: "desc" },
      include: { bank: { select: { name: true, shortName: true } } },
    }),
    prisma.bankerRegistration.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count.id]));
  const pendingCount = countMap["pending"] ?? 0;

  return (
    <AdminPage
      badge="Hệ thống / Đăng ký Banker"
      description="Xem xét và phê duyệt các yêu cầu đăng ký tư vấn viên ngân hàng. Phê duyệt sẽ tự động tạo tài khoản và hồ sơ banker."
      feedback={resolveFeedback(params?.feedback)}
      title={`Đăng ký Banker${pendingCount > 0 ? ` (${pendingCount} chờ duyệt)` : ""}`}
    >
      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-[var(--bankng-border)] pb-4">
        {[
          { value: "pending",  label: `Chờ duyệt (${countMap["pending"] ?? 0})` },
          { value: "approved", label: `Đã duyệt (${countMap["approved"] ?? 0})` },
          { value: "rejected", label: `Từ chối (${countMap["rejected"] ?? 0})` },
          { value: "all",      label: "Tất cả" },
        ].map((tab) => (
          <a
            key={tab.value}
            href={`/banker-registrations?status=${tab.value}`}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === tab.value
                ? "bg-[var(--bankng-primary)] text-white"
                : "text-[var(--bankng-text-secondary)] hover:bg-[var(--bankng-surface-muted)]"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <SectionCard title={`Danh sách đăng ký (${registrations.length})`}>
        {registrations.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--bankng-text-secondary)]">
            Không có đăng ký nào trong trạng thái này.
          </p>
        ) : (
          <DataTable
            headers={["Người đăng ký", "Ngân hàng", "Tỉnh/Thành", "Trạng thái", "Ngày gửi", "Thao tác"]}
            rows={registrations.map((reg) => {
              const statusInfo = STATUS_MAP[reg.status] ?? { label: reg.status, className: "" };
              return (
                <tr key={reg.id}>
                  <TableCell>
                    <div className="font-medium">{reg.fullName}</div>
                    <div className="text-xs text-[var(--bankng-text-secondary)]">{reg.email}</div>
                    <div className="text-xs text-[var(--bankng-text-secondary)]">{reg.phone}</div>
                    {reg.title && (
                      <div className="text-xs text-[var(--bankng-text-secondary)] italic">{reg.title}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{reg.bank.shortName ?? reg.bank.name}</div>
                    <div className="text-xs text-[var(--bankng-text-secondary)]">{reg.bank.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{reg.provinceCode ?? "—"}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.className}`}>
                      {statusInfo.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{reg.createdAt.toISOString().slice(0, 10)}</div>
                  </TableCell>
                  <TableCell>
                    {reg.status === "pending" ? (
                      <div className="flex flex-col gap-2">
                        <form action={approveRegistrationAction}>
                          <input type="hidden" name="id" value={reg.id} />
                          <input type="hidden" name="email" value={reg.email} />
                          <input type="hidden" name="fullName" value={reg.fullName} />
                          <input type="hidden" name="bankId" value={reg.bankId} />
                          <input type="hidden" name="title" value={reg.title ?? ""} />
                          <input type="hidden" name="provinceCode" value={reg.provinceCode ?? ""} />
                          <button
                            type="submit"
                            className="w-full rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                          >
                            ✓ Phê duyệt
                          </button>
                        </form>
                        <form action={rejectRegistrationAction}>
                          <input type="hidden" name="id" value={reg.id} />
                          <button
                            type="submit"
                            className="w-full rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                          >
                            ✕ Từ chối
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="text-xs text-[var(--bankng-text-secondary)]">
                        {reg.reviewedAt ? reg.reviewedAt.toISOString().slice(0, 10) : "—"}
                      </div>
                    )}
                  </TableCell>
                </tr>
              );
            })}
          />
        )}
      </SectionCard>
    </AdminPage>
  );
}
