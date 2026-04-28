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
      description="100 log mutation gan nhat cho catalog va rates."
      title="Audit Logs"
    >
      <SectionCard title="Recent mutations">
        <DataTable
          headers={["When", "Actor", "Entity", "Action", "Metadata"]}
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
