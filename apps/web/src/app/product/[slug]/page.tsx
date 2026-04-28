import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@bankng/ui";
import { getPublicProduct } from "@/modules/public/data";
import { LeadCtaForm } from "@/modules/public/components/lead-cta-form";
import { RateCard } from "@/modules/public/components/rate-card";
import { PublicBadge } from "@/modules/public/components/public-badge";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getPublicProduct(slug);

  return {
    title: product ? `${product.name} | Bankng Product` : "Bankng Product",
    description:
      product?.shortDescription ??
      product?.longDescription ??
      "Chi tiet san pham ngan hang duoc render tu du lieu public hien tai."
  };
}

export default async function ProductDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ feedback?: string }>;
}) {
  const { slug } = await params;
  const filters = searchParams ? await searchParams : undefined;
  const product = await getPublicProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-wrap gap-2">
          <PublicBadge>{product.category.name}</PublicBadge>
          <PublicBadge tone="success">{product.bank.name}</PublicBadge>
        </div>
        <div>
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="mt-3 max-w-3xl text-sm text-[var(--bankng-text-secondary)]">
            {product.shortDescription ?? product.longDescription ?? "Chua co mo ta chi tiet."}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link className="font-medium text-[var(--bankng-primary)]" href={`/compare/${product.category.slug}`}>
              Quay lai compare
            </Link>
            <Link className="font-medium text-[var(--bankng-primary)]" href={`/bank/${product.bank.slug}`}>
              Xem ngan hang
            </Link>
          </div>
        </div>

        <Card title="Nguon du lieu & canh bao">
          <div className="grid gap-2 text-sm text-[var(--bankng-text-secondary)]">
            <p>Thong tin nay duoc render tu product va rate public trong he thong.</p>
            <p>Ban nen doi chieu voi nguon chinh thuc cua ngan hang truoc khi ra quyet dinh.</p>
          </div>
        </Card>

        {filters?.feedback === "lead_created" ? (
          <div className="rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3">
            <div className="font-semibold">Da ghi nhan lead</div>
            <div className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
              Yeu cau tu van san pham da duoc luu.
            </div>
          </div>
        ) : filters?.feedback === "lead_duplicate" ? (
          <div className="rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3">
            <div className="font-semibold">Lead da ton tai</div>
            <div className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
              Ban da gui yeu cau cho san pham nay trong 24h gan day.
            </div>
          </div>
        ) : null}

        <LeadCtaForm
          contextSlug={slug}
          contextType="product"
          description="Muon duoc tu van them ve san pham nay? De lai thong tin de doi ngu tiep nhan lead."
          sourcePage={`/product/${slug}`}
          title="Lead CTA"
        />

        <div className="grid gap-4 md:grid-cols-2">
          {product.variants.map((variant) => (
            <Card key={variant.id} title={variant.variantName}>
              <p className="text-sm text-[var(--bankng-text-secondary)]">
                Segment: {variant.targetSegment ?? "General"} | Term: {variant.minTermMonth ?? "-"}-
                {variant.maxTermMonth ?? "-"} thang
              </p>
              <div className="mt-4 grid gap-3">
                {variant.rates.length === 0 ? (
                  <p className="text-sm text-[var(--bankng-text-secondary)]">
                    Chua co rate public cho variant nay.
                  </p>
                ) : (
                  variant.rates.map((rate) => <RateCard key={rate.id} rate={rate} />)
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
