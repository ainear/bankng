import { prisma } from "@bankng/db";
import {
  AdminPage,
  DataTable,
  FormActions,
  Input,
  SectionCard,
  SelectField,
  TableCell
} from "../shared/page-ui";
import { filterLeads } from "./filter";
import { resolveFeedback } from "../shared/server/feedback";
import { updateLeadAction } from "./actions";

export default async function LeadsPage({
  searchParams
}: {
  searchParams?: Promise<{ feedback?: string; status?: string; assignee?: string; contextType?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const [leads, assignees] = await Promise.all([
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        assignedTo: {
          select: {
            id: true,
            email: true
          }
        },
        history: {
          orderBy: { createdAt: "desc" },
          take: 3,
          include: {
            actor: {
              select: { email: true }
            }
          }
        }
      }
    }),
    prisma.user.findMany({
      where: { status: "active" },
      select: {
        id: true,
        email: true
      },
      orderBy: { email: "asc" }
    })
  ]);

  const assigneeOptions = [
    { label: "Chua gan", value: "" },
    { label: "Unassigned only", value: "unassigned" },
    ...assignees.map((user) => ({
      label: user.email,
      value: user.id
    }))
  ];
  const statusOptions = [
    { label: "new", value: "new" },
    { label: "contacted", value: "contacted" },
    { label: "qualified", value: "qualified" },
    { label: "closed", value: "closed" }
  ];
  const contextOptions = [
    { label: "Tat ca context", value: "" },
    { label: "category", value: "category" },
    { label: "product", value: "product" },
    { label: "bank", value: "bank" }
  ];
  const filteredLeads = filterLeads({
    leads,
    status: params?.status,
    assignee: params?.assignee,
    contextType: params?.contextType
  });
  const queueSummary = [
    {
      label: "new",
      count: leads.filter((lead) => lead.status === "new").length
    },
    {
      label: "contacted",
      count: leads.filter((lead) => lead.status === "contacted").length
    },
    {
      label: "assigned",
      count: leads.filter((lead) => Boolean(lead.assignedToId)).length
    }
  ];

  return (
    <AdminPage
      badge="CRM / Leads"
      description="Quan ly lead tu public compare/product/bank funnels."
      feedback={resolveFeedback(params?.feedback)}
      title="Leads CRM"
    >
      <SectionCard title="Lead queues">
        <div className="grid gap-4 md:grid-cols-3">
          {queueSummary.map((item) => (
            <div
              className="rounded-md border border-[var(--bankng-border)] bg-white px-4 py-3"
              key={item.label}
            >
              <div className="text-sm text-[var(--bankng-text-secondary)]">Queue: {item.label}</div>
              <div className="mt-1 text-2xl font-semibold">{item.count}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Bo loc lead">
        <form className="grid gap-4 md:grid-cols-4">
          <SelectField
            defaultValue={params?.status ?? ""}
            label="Filter status"
            name="status"
            options={[{ label: "Tat ca status", value: "" }, ...statusOptions]}
          />
          <SelectField
            defaultValue={params?.assignee ?? ""}
            label="Filter assignee"
            name="assignee"
            options={assigneeOptions}
          />
          <SelectField
            defaultValue={params?.contextType ?? ""}
            label="Filter context"
            name="contextType"
            options={contextOptions}
          />
          <div className="flex items-end gap-3">
            <FormActions primaryLabel="Loc" />
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Danh sach lead">
        <DataTable
          headers={["Lead", "Nguon", "Trang thai", "Gan cho", "Cap nhat"]}
          rows={filteredLeads.map((lead) => (
            <tr key={lead.id}>
              <TableCell>
                <div className="font-medium">{lead.name}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">{lead.phone}</div>
                {lead.email ? (
                  <div className="text-xs text-[var(--bankng-text-secondary)]">{lead.email}</div>
                ) : null}
              </TableCell>
              <TableCell>
                <div>{lead.contextType}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">{lead.contextSlug}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">{lead.sourcePage}</div>
              </TableCell>
              <TableCell>{lead.status}</TableCell>
              <TableCell>{lead.assignedTo?.email ?? "Chua gan"}</TableCell>
              <TableCell>
                <form action={updateLeadAction} className="grid gap-2">
                  <input name="id" type="hidden" value={lead.id} />
                  <SelectField
                    defaultValue={lead.status}
                    label="Trang thai"
                    name="status"
                    options={statusOptions}
                  />
                  <SelectField
                    defaultValue={lead.assignedToId ?? ""}
                    label="Gan cho"
                    name="assignedToId"
                    options={assigneeOptions}
                  />
                  <Input defaultValue={lead.message ?? ""} label="Ghi chu" name="note" />
                  <FormActions primaryLabel="Luu lead" />
                </form>
                <div className="mt-3 grid gap-1 text-xs text-[var(--bankng-text-secondary)]">
                  {lead.history.map((item) => (
                    <div key={item.id}>
                      {item.fromStatus ?? "none"} → {item.toStatus} by {item.actor?.email ?? "system"}
                    </div>
                  ))}
                </div>
              </TableCell>
            </tr>
          ))}
        />
      </SectionCard>
    </AdminPage>
  );
}
