import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@bankng/ui";
import { getPublicBank } from "@/modules/public/data";
import { EmptyState } from "@/modules/public/components/empty-state";
import { LeadCtaForm } from "@/modules/public/components/lead-cta-form";
import { PublicBadge } from "@/modules/public/components/public-badge";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bank = await getPublicBank(slug);

  return {
    title: bank ? `${bank.name} | Bankng Bank` : "Bankng Bank",
    description:
      bank?.description ?? "Thong tin ngan hang va san pham cong khai duoc render tu catalog hien tai."
  };
}

export default async function BankDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ feedback?: string }>;
}) {
  const { slug } = await params;
  const filters = searchParams ? await searchParams : undefined;
  const bank = await getPublicBank(slug);

  if (!bank) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-wrap gap-2">
          <PublicBadge tone="success">{bank.shortName ?? bank.name}</PublicBadge>
          {bank.websiteUrl ? <PublicBadge>{bank.websiteUrl}</PublicBadge> : null}
        </div>
        <div>
          <h1 className="text-3xl font-semibold">{bank.name}</h1>
          <p className="mt-3 max-w-3xl text-sm text-[var(--bankng-text-secondary)]">
            {bank.description ?? "Thong tin ngan hang dang duoc render tu catalog hien tai."}
          </p>
        </div>

        <Card title="Nguon du lieu & canh bao">
          <div className="grid gap-2 text-sm text-[var(--bankng-text-secondary)]">
            <p>Bank detail page nay duoc render tu catalog public va branch data hien co.</p>
            <p>Du lieu branch/rate co the thay doi theo khu vuc va thoi diem cap nhat.</p>
          </div>
        </Card>

        {filters?.feedback === "lead_created" ? (
          <div className="rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3">
            <div className="font-semibold">Da ghi nhan lead</div>
            <div className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
              Yeu cau ket noi voi ngan hang da duoc luu.
            </div>
          </div>
        ) : filters?.feedback === "lead_duplicate" ? (
          <div className="rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3">
            <div className="font-semibold">Lead da ton tai</div>
            <div className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
              Ban da gui yeu cau cho ngan hang nay trong 24h gan day.
            </div>
          </div>
        ) : null}

        <LeadCtaForm
          contextSlug={slug}
          contextType="bank"
          description="Can ket noi banker hoac sales cua ngan hang nay? De lai thong tin de doi ngu tiep nhan lead."
          sourcePage={`/bank/${slug}`}
          title="Lead CTA"
        />

        <Card title="Chi nhanh">
          {bank.branches.length === 0 ? (
            <EmptyState description="Chua co branch public cho ngan hang nay." title="Khong co branch" />
          ) : (
            <div className="grid gap-3">
              {bank.branches.map((branch) => (
                <div className="rounded-md border border-[var(--bankng-border)] p-3" key={branch.id}>
                  <div className="font-medium">{branch.branchName}</div>
                  <div className="text-sm text-[var(--bankng-text-secondary)]">
                    {branch.provinceCode} / {branch.districtCode ?? "No district"}
                  </div>
                  <div className="text-sm text-[var(--bankng-text-secondary)]">
                    {branch.address ?? "No address"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="San pham cong khai">
          {bank.products.length === 0 ? (
            <EmptyState description="Bank nay chua co product public." title="Khong co product public" />
          ) : (
            <div className="grid gap-3">
              {bank.products.map((product) => (
                <div className="rounded-md border border-[var(--bankng-border)] p-4" key={product.id}>
                  <div className="flex flex-wrap gap-2">
                    <PublicBadge>{product.category.name}</PublicBadge>
                    <PublicBadge tone={product.isPublic ? "success" : "warning"}>
                      {product.status}
                    </PublicBadge>
                  </div>
                  <div className="mt-2 font-medium">{product.name}</div>
                  <p className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
                    {product.shortDescription ?? "Chua co mo ta ngan."}
                  </p>
                  <div className="mt-3">
                    <Link className="text-sm font-medium text-[var(--bankng-primary)]" href={`/product/${product.slug}`}>
                      Xem product
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </main>
  );
}
