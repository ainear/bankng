import Link from "next/link";
import { Card } from "@bankng/ui";
import { PublicBadge } from "./public-badge";

export function ProductCard({
  product
}: {
  product: {
    slug: string;
    name: string;
    shortDescription: string | null;
    bank: { slug: string; name: string };
    variants: Array<{ rates: Array<{ rateValue: number | string | { toString(): string } }> }>;
  };
}) {
  const topRate = product.variants.flatMap((variant) => variant.rates)[0];

  return (
    <Card title={product.name}>
      <div className="flex flex-wrap gap-2">
        <PublicBadge>{product.bank.name}</PublicBadge>
        {topRate ? (
          <PublicBadge tone="success">{`${topRate.rateValue.toString()}%/nam`}</PublicBadge>
        ) : null}
      </div>
      <p className="mt-3 text-sm text-[var(--bankng-text-secondary)]">
        {product.shortDescription ?? "Chua co mo ta ngan cho san pham nay."}
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link className="font-medium text-[var(--bankng-primary)]" href={`/product/${product.slug}`}>
          Xem chi tiet
        </Link>
        <Link className="font-medium text-[var(--bankng-primary)]" href={`/bank/${product.bank.slug}`}>
          Xem ngan hang
        </Link>
      </div>
    </Card>
  );
}
