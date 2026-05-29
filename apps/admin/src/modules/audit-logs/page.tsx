import { prisma } from "@bankng/db";
import { AdminPage, DataTable, SectionCard, TableCell } from "@/modules/shared/page-ui";

export default async function AuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      actor: {
        select: {
          email: true
        }
      }
    }
  });

  return (
    <AdminPage
      badge="Audit"
      description="100 bản ghi thay đổi gần nhất cho catalog và lãi suất."
      title="Nhật ký hệ thống"
    >
      <SectionCard title="Thay đổi gần đây">
        <DataTable
          headers={["Thời gian", "Người thực hiện", "Đối tượng", "Hành động", "Dữ liệu"]}
          rows={logs.map((log) => (
            <tr key={log.id}>
              <TableCell>{log.createdAt.toISOString()}</TableCell>
              <TableCell>{log.actor?.email ?? "system"}</TableCell>
              <TableCell>
                <div>{log.entityType}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">{log.entityId}</div>
              </TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>
                <pre className="whitespace-pre-wrap text-xs text-[var(--bankng-text-secondary)]">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </TableCell>
            </tr>
          ))}
        />
      </SectionCard>
    </AdminPage>
  );
}
