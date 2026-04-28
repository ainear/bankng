import Link from "next/link";
import { Button, Card } from "@bankng/ui";
import { getPublicHomeData } from "@/modules/public/data";
import { EmptyState } from "@/modules/public/components/empty-state";
import { ProductCard } from "@/modules/public/components/product-card";
import { PublicBadge } from "@/modules/public/components/public-badge";

export default async function HomePage() {
  const { categories, products } = await getPublicHomeData();

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
        <PublicBadge tone="success">Live catalog preview</PublicBadge>
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            So sanh san pham ngan hang tren mot nen tang du lieu co kiem chung.
          </h1>
          <p className="mt-5 text-lg text-[var(--bankng-text-secondary)]">
            Bankng tap trung vao bang so sanh, cong cu tinh va lead tu van. M1 hien chi la
            foundation shell, chua phai du lieu san pham that.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {categories[0] ? (
            <Link href={`/compare/${categories[0].slug}`}>
              <Button>So sanh san pham</Button>
            </Link>
          ) : (
            <Button disabled>So sanh san pham</Button>
          )}
          <Button variant="secondary">Tinh lai suat</Button>
          <Button variant="ghost">Tim banker</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {categories.length === 0 ? (
            <EmptyState
              description="Chua co category public trong catalog."
              title="Khong co du lieu compare"
            />
          ) : (
            categories.map((category) => (
              <Card key={category.id} title={category.name}>
                <p className="text-sm text-[var(--bankng-text-secondary)]">
                  {category.description ?? "Danh muc public san sang cho compare page."}
                </p>
                <div className="mt-4">
                  <Link
                    className="text-sm font-medium text-[var(--bankng-primary)]"
                    href={`/compare/${category.slug}`}
                  >
                    Mo compare page
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {products.length === 0 ? (
            <EmptyState
              description="Chua co san pham public de hien thi tren homepage."
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
      </section>
    </main>
  );
}
