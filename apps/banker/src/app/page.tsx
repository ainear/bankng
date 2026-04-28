import { Badge, Card } from "@bankng/ui";

const sections = ["Ho so", "Xac minh", "Lead inbox"];

export default function BankerHomePage() {
  return (
    <main className="min-h-screen bg-[var(--bankng-background)] px-6 py-10 text-[var(--bankng-text-primary)]">
      <section className="mx-auto max-w-5xl">
        <Badge>Banker foundation</Badge>
        <h1 className="mt-4 text-3xl font-semibold">Portal banker</h1>
        <p className="mt-3 max-w-2xl text-[var(--bankng-text-secondary)]">
          Shell nay se phat trien thanh CRM nhe cho ho so, xac minh va xu ly lead duoc gan.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {sections.map((section) => (
            <Card key={section} title={section}>
              <p className="text-sm text-[var(--bankng-text-secondary)]">
                Workflow chi tiet se duoc them sau M1.
              </p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
