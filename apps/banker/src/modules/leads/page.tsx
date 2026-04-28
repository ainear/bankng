import { prisma } from "@bankng/db";
import { Badge, Card } from "@bankng/ui";
import { updateBankerLeadStatusAction } from "./actions";

export default async function BankerLeadsPage({
  searchParams
}: {
  searchParams?: Promise<{ feedback?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const bankerEmail = process.env.BANKER_EMAIL ?? "banker@bankng.local";
  const banker = await prisma.user.findUnique({
    where: { email: bankerEmail },
    select: { id: true, email: true }
  });

  const leads = banker
    ? await prisma.lead.findMany({
        where: { assignedToId: banker.id },
        orderBy: { createdAt: "desc" },
        include: {
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
      })
    : [];

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] px-6 py-10 text-[var(--bankng-text-primary)]">
      <section className="mx-auto max-w-5xl">
        <Badge>Banker leads</Badge>
        <h1 className="mt-4 text-3xl font-semibold">Lead inbox</h1>
        <p className="mt-3 max-w-2xl text-[var(--bankng-text-secondary)]">
          Banker inbox toi thieu doc lead duoc assign cho {banker?.email ?? bankerEmail}.
        </p>
        {params?.feedback === "lead_updated" ? (
          <div className="mt-4 rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3 text-sm">
            Da cap nhat lead
          </div>
        ) : null}
        <div className="mt-8 grid gap-4">
          {leads.length === 0 ? (
            <Card title="Chua co lead duoc giao">
              <p className="text-sm text-[var(--bankng-text-secondary)]">
                Khi admin gan lead cho banker nay, danh sach se hien thi tai day.
              </p>
            </Card>
          ) : (
            leads.map((lead: (typeof leads)[number]) => (
              <Card key={lead.id} title={lead.name}>
                <div className="grid gap-1 text-sm text-[var(--bankng-text-secondary)]">
                  <div>Phone: {lead.phone}</div>
                  <div>Status: {lead.status}</div>
                  <div>
                    Source: {lead.contextType} / {lead.contextSlug}
                  </div>
                  <div>{lead.sourcePage}</div>
                </div>
                <form action={updateBankerLeadStatusAction} className="mt-4 grid gap-2">
                  <input name="id" type="hidden" value={lead.id} />
                  <label className="grid gap-1 text-sm">
                    <span>Trang thai</span>
                    <select
                      className="min-h-10 rounded-md border border-[var(--bankng-border)] bg-white px-3 py-2"
                      defaultValue={lead.status}
                      name="status"
                    >
                      <option value="contacted">contacted</option>
                      <option value="qualified">qualified</option>
                      <option value="closed">closed</option>
                    </select>
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span>Ghi chu</span>
                    <input
                      className="min-h-10 rounded-md border border-[var(--bankng-border)] bg-white px-3 py-2"
                      defaultValue={lead.message ?? ""}
                      name="note"
                    />
                  </label>
                  <button
                    className="rounded-md border border-[var(--bankng-border)] px-3 py-2 text-sm"
                    type="submit"
                  >
                    Cap nhat lead
                  </button>
                </form>
                <div className="mt-3 grid gap-1 text-xs text-[var(--bankng-text-secondary)]">
                  {lead.history.map((item) => (
                    <div key={item.id}>
                      {item.fromStatus ?? "none"} → {item.toStatus} by {item.actor?.email ?? "system"}
                    </div>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
