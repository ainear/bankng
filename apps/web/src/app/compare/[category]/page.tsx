import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Card } from "@bankng/ui";
import { getCompareCategory } from "@/modules/public/data";
import { EmptyState } from "@/modules/public/components/empty-state";
import { ProductCard } from "@/modules/public/components/product-card";
import { PublicBadge } from "@/modules/public/components/public-badge";
import { LeadCtaForm } from "@/modules/public/components/lead-cta-form";
import { filterCompareProducts } from "@/modules/public/filter-products";
import { getPublicFreshness } from "@/modules/public/freshness";

export async function generateMetadata({
  params
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryData = await getCompareCategory(category);

  return {
    title: categoryData ? `${categoryData.name} | Bankng Compare` : "Bankng Compare",
    description: categoryData?.description ?? "So sanh san pham ngan hang tu du lieu public hien tai."
  };
}

export default async function CompareCategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ bank?: string; term?: string; status?: string; sort?: string; feedback?: string }>;
}) {
  const { category: slug } = await params;
  const filters = searchParams ? await searchParams : undefined;
  const category = await getCompareCategory(slug);

  if (!category || !category.compareEnabled || !category.isActive) {
    notFound();
  }

  const products = filterCompareProducts({
    products: category.products,
    bank: filters?.bank,
    term: filters?.term,
    status: filters?.status
  }).sort((left, right) => {
    if (filters?.sort === "rate_desc") {
      const leftRate = Number(left.variants.flatMap((variant) => variant.rates)[0]?.rateValue ?? 0);
      const rightRate = Number(right.variants.flatMap((variant) => variant.rates)[0]?.rateValue ?? 0);
      return rightRate - leftRate;
    }

    if (filters?.sort === "bank_asc") {
      return left.bank.name.localeCompare(right.bank.name);
    }

    return left.name.localeCompare(right.name);
  });
  const bankOptions = Array.from(
    new Set(category.products.map((product) => product.bank.slug)),
  ).map((bankSlug) => {
    const bank = category.products.find((product) => product.bank.slug === bankSlug)?.bank;
    return { slug: bankSlug, name: bank?.name ?? bankSlug };
  });
  const termOptions = Array.from(
    new Set(
      category.products.flatMap((product) =>
        product.variants
          .map((variant) => variant.minTermMonth)
          .filter((value): value is number => typeof value === "number"),
      ),
    ),
  ).sort((left, right) => left - right);

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <div>
          <Link className="text-sm text-[var(--bankng-primary)]" href="/">
            Trang chu
          </Link>
          <h1 className="mt-3 text-3xl font-semibold">{category.name}</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--bankng-text-secondary)]">
            {category.description ?? "Compare page dang su dung du lieu public tu catalog hien tai."}
          </p>
        </div>

        <Card className="sticky top-4 z-10" title="Bo loc compare">
          <form className="grid gap-4 md:grid-cols-5">
            <label className="grid gap-1 text-sm">
              <span>Bank</span>
              <select
                className="min-h-10 rounded-md border border-[var(--bankng-border)] bg-white px-3 py-2"
                defaultValue={filters?.bank ?? ""}
                name="bank"
              >
                <option value="">Tat ca bank</option>
                {bankOptions.map((bank) => (
                  <option key={bank.slug} value={bank.slug}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span>Term</span>
              <select
                className="min-h-10 rounded-md border border-[var(--bankng-border)] bg-white px-3 py-2"
                defaultValue={filters?.term ?? ""}
                name="term"
              >
                <option value="">Tat ca ky han</option>
                {termOptions.map((term) => (
                  <option key={term} value={term}>
                    {term} thang
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span>Status</span>
              <select
                className="min-h-10 rounded-md border border-[var(--bankng-border)] bg-white px-3 py-2"
                defaultValue={filters?.status ?? ""}
                name="status"
              >
                <option value="">Tat ca</option>
                <option value="verified">verified</option>
                <option value="pending">pending</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span>Sap xep</span>
              <select
                aria-label="Sap xep"
                className="min-h-10 rounded-md border border-[var(--bankng-border)] bg-white px-3 py-2"
                defaultValue={filters?.sort ?? ""}
                name="sort"
              >
                <option value="">Mac dinh</option>
                <option value="bank_asc">Bank A-Z</option>
                <option value="rate_desc">Rate cao {"->"} thap</option>
              </select>
            </label>
            <div className="flex items-end gap-3">
              <Button type="submit">Loc</Button>
              <Link className="text-sm text-[var(--bankng-primary)]" href={`/compare/${slug}`}>
                Reset
              </Link>
            </div>
          </form>
        </Card>

        {filters?.feedback === "lead_created" ? (
          <div className="rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3">
            <div className="font-semibold">Da ghi nhan lead</div>
            <div className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
              Yeu cau cua ban da duoc luu. Lead flow chi tiet se duoc mo rong o phase sau.
            </div>
          </div>
        ) : filters?.feedback === "lead_duplicate" ? (
          <div className="rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3">
            <div className="font-semibold">Lead da ton tai</div>
            <div className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
              Ban da gui yeu cau cho context nay trong 24h gan day.
            </div>
          </div>
        ) : null}

        <Card className="hidden md:block" title="Bang so sanh">
          {products.length === 0 ? (
            <EmptyState
              description="Khong co san pham public khop bo loc hien tai."
              title="Khong co ket qua"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--bankng-surface-muted)]">
                  <tr>
                    <th className="px-4 py-3">San pham</th>
                    <th className="px-4 py-3">Bank</th>
                    <th className="px-4 py-3">Variant</th>
                    <th className="px-4 py-3">Top rate</th>
                    <th className="px-4 py-3">Freshness</th>
                    <th className="px-4 py-3">Chi tiet</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const topRate = product.variants.flatMap((variant) => variant.rates)[0];
                    const freshness = topRate
                      ? getPublicFreshness({
                          status: topRate.status,
                          effectiveFrom: topRate.effectiveFrom,
                          updatedAt: topRate.updatedAt,
                          now: new Date(),
                          reliabilityScore: topRate.source?.reliabilityScore ?? null
                        })
                      : null;

                    return (
                      <tr key={product.id}>
                        <td className="border-t border-[var(--bankng-border)] px-4 py-3">
                          {product.name}
                        </td>
                        <td className="border-t border-[var(--bankng-border)] px-4 py-3">
                          {product.bank.name}
                        </td>
                        <td className="border-t border-[var(--bankng-border)] px-4 py-3">
                          {product.variants.map((variant) => variant.variantName).join(", ")}
                        </td>
                        <td className="border-t border-[var(--bankng-border)] px-4 py-3">
                          {topRate ? `${topRate.rateValue.toString()} ${topRate.rateUnit}` : "No rate"}
                        </td>
                        <td className="border-t border-[var(--bankng-border)] px-4 py-3">
                          {freshness ? (
                            <PublicBadge tone={freshness.tone}>{freshness.label}</PublicBadge>
                          ) : (
                            "No data"
                          )}
                        </td>
                        <td className="border-t border-[var(--bankng-border)] px-4 py-3">
                          <Link className="text-[var(--bankng-primary)]" href={`/product/${product.slug}`}>
                            Xem product
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="md:hidden" title="Cards mobile">
          <div className="grid gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  slug: product.slug,
                  name: product.name,
                  shortDescription: product.shortDescription,
                  bank: {
                    slug: product.bank.slug,
                    name: product.bank.name
                  },
                  variants: product.variants.map((variant) => ({
                    rates: variant.rates
                  }))
                }}
              />
            ))}
          </div>
        </Card>

        <Card title="Nguon du lieu & canh bao">
          <div className="grid gap-2 text-sm text-[var(--bankng-text-secondary)]">
            <p>Du lieu duoc lay tu catalog/rates hien co trong he thong va khong thay cho tu van tai chinh ca nhan.</p>
            <p>Rate public can duoc doi chieu voi nguon chinh thuc truoc khi ra quyet dinh.</p>
            <p>Trang nay uu tien hien thi source, freshness va verification status de tang trust.</p>
          </div>
        </Card>

        <LeadCtaForm
          contextSlug={slug}
          contextType="category"
          description="Can duoc tu van nhanh ve danh muc nay? De lai thong tin de doi ngu tiep nhan lead."
          sourcePage={`/compare/${slug}`}
          title="Lead CTA"
        />

        <Card title="Danh sach san pham">
          <div className="grid gap-4 md:grid-cols-2">
            {products.length === 0 ? (
              <EmptyState
                description="Danh muc nay chua co san pham public khop bo loc hien tai."
                title="Khong co san pham public"
              />
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    slug: product.slug,
                    name: product.name,
                    shortDescription: product.shortDescription,
                    bank: {
                      slug: product.bank.slug,
                      name: product.bank.name
                    },
                    variants: product.variants.map((variant) => ({
                      rates: variant.rates
                    }))
                  }}
                />
              ))
            )}
          </div>
        </Card>
      </section>
    </main>
  );
}
