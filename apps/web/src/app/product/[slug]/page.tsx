import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@bankng/ui";
import { getPublicProduct, getPublicProductSlugs } from "@/modules/public/data";
import { LeadCtaForm } from "@/modules/public/components/lead-cta-form";
import { RateCard } from "@/modules/public/components/rate-card";
import { PublicBadge } from "@/modules/public/components/public-badge";
import { Breadcrumb } from "@/components/breadcrumb";

export async function generateStaticParams() {
  try {
    return await getPublicProductSlugs();
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getPublicProduct(slug);

  if (!product) {
    return {
      title: "Sản phẩm tài chính không tồn tại | Bankng",
      description: "Sản phẩm tài chính bạn đang tìm kiếm hiện không tồn tại hoặc đã được chuyển sang đường dẫn khác."
    };
  }

  const bankName = product.bank.shortName ?? product.bank.name;
  const categoryName = product.category.name;

  return {
    title: `${product.name} - Lãi suất tốt nhất từ ${bankName} | Bankng`,
    description: `Đăng ký nhận tư vấn ${product.name} của ngân hàng ${bankName} (${categoryName}). Cập nhật lãi suất ưu đãi, điều kiện và hồ sơ vay chi tiết mới nhất năm 2026 tại Bankng.vn.`,
    keywords: `${product.name}, ${bankName}, lãi suất ${bankName}, so sánh ${categoryName}, vay vốn ${bankName}`,
    openGraph: {
      title: `${product.name} - Lãi suất tốt nhất từ ${bankName} | Bankng`,
      description: `Đăng ký nhận tư vấn sản phẩm ${product.name} của ngân hàng ${bankName}. Chi tiết lãi suất, điều kiện vay tại Bankng.`,
      type: "website",
      images: product.bank.logoUrl ? [product.bank.logoUrl] : []
    }
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
        <div>
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "So sánh", href: "/compare" },
              { label: product.category.name, href: `/compare/${product.category.slug}` },
              { label: product.name }
            ]}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <PublicBadge>{String(product.category.name)}</PublicBadge>
            <PublicBadge tone="success">{String(product.bank.name)}</PublicBadge>
          </div>
          <h1 className="mt-3 text-3xl font-semibold">{product.name}</h1>
          <p className="mt-3 max-w-3xl text-sm text-[var(--bankng-text-secondary)]">
            {product.shortDescription ?? product.longDescription ?? "Chưa có mô tả chi tiết."}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link className="font-medium text-[var(--bankng-primary)] hover:underline" href={`/compare/${product.category.slug}`}>
              ← Quay lại so sánh
            </Link>
            <Link className="font-medium text-[var(--bankng-primary)] hover:underline" href={`/bank/${product.bank.slug}`}>
              Xem ngân hàng {product.bank.shortName ?? product.bank.name}
            </Link>
          </div>
        </div>

        <Card title="Nguồn dữ liệu & cảnh báo">
          <div className="grid gap-2 text-sm text-[var(--bankng-text-secondary)]">
            <p>Thông tin này được hiển thị từ sản phẩm và lãi suất công khai trong hệ thống.</p>
            <p>Bạn nên đối chiếu với nguồn chính thức của ngân hàng trước khi ra quyết định.</p>
          </div>
        </Card>

        {filters?.feedback === "lead_created" ? (
          <div className="rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3">
            <div className="font-semibold">Đã ghi nhận yêu cầu</div>
            <div className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
              Yêu cầu tư vấn sản phẩm đã được lưu.
            </div>
          </div>
        ) : filters?.feedback === "lead_duplicate" ? (
          <div className="rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3">
            <div className="font-semibold">Yêu cầu đã tồn tại</div>
            <div className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
              Bạn đã gửi yêu cầu cho sản phẩm này trong vòng 24 giờ qua.
            </div>
          </div>
        ) : null}

        <LeadCtaForm
          contextSlug={slug}
          contextType="product"
          description="Muốn được tư vấn thêm về sản phẩm này? Để lại thông tin để đội ngũ tiếp nhận."
          sourcePage={`/product/${slug}`}
          title="Nhận tư vấn sản phẩm"
        />

        <div className="grid gap-4 md:grid-cols-2">
          {product.variants.map((variant) => (
            <Card key={variant.id} title={variant.variantName}>
              <p className="text-sm text-[var(--bankng-text-secondary)]">
                {variant.targetSegment ? `Đối tượng: ${variant.targetSegment}` : "Đối tượng: Phổ thông"}
                {variant.minTermMonth != null || variant.maxTermMonth != null
                  ? ` | Kỳ hạn: ${variant.minTermMonth ?? "—"}–${variant.maxTermMonth ?? "—"} tháng`
                  : ""}
              </p>
              <div className="mt-4 grid gap-3">
                {variant.rates.length === 0 ? (
                  <p className="text-sm text-[var(--bankng-text-secondary)]">
                    Chưa có lãi suất công khai cho gói này.
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
