import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@bankng/ui";
import { getPublicBank, getPublicBankSlugs } from "@/modules/public/data";
import { EmptyState } from "@/modules/public/components/empty-state";
import { LeadCtaForm } from "@/modules/public/components/lead-cta-form";
import { PublicBadge } from "@/modules/public/components/public-badge";
import { Breadcrumb } from "@/components/breadcrumb";

export async function generateStaticParams() {
  try {
    return await getPublicBankSlugs();
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
  const bank = await getPublicBank(slug);

  if (!bank) {
    return {
      title: "Ngân hàng không tồn tại | Bankng",
      description: "Ngân hàng bạn đang tìm kiếm hiện không tồn tại hoặc đã được gỡ bỏ khỏi hệ thống."
    };
  }

  const displayName = bank.shortName ? `${bank.name} (${bank.shortName})` : bank.name;

  return {
    title: `${displayName} - Lãi suất, chi nhánh & sản phẩm tài chính mới nhất | Bankng`,
    description: `Xem chi tiết lãi suất tiết kiệm, gói vay mua nhà, vay mua xe và danh sách chi nhánh/phòng giao dịch ngân hàng ${displayName}. Đăng ký kết nối tư vấn trực tiếp với Banker tại Bankng.vn.`,
    keywords: `lãi suất ${bank.name}, chi nhánh ${bank.name}, ${bank.shortName ?? bank.name}, so sánh lãi suất ${bank.name}`,
    openGraph: {
      title: `${displayName} - Thông tin lãi suất & sản phẩm tài chính | Bankng`,
      description: `Chi tiết lãi suất, sản phẩm và chi nhánh ngân hàng ${displayName}. Kết nối trực tiếp với Banker để nhận tư vấn.`,
      type: "website",
      images: bank.logoUrl ? [bank.logoUrl] : []
    }
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

  // Generate Bank Schema & Branch Schemas for SEO structured data
  const bankSchema = {
    "@context": "https://schema.org",
    "@type": "BankOrCreditUnion",
    "name": bank.name,
    "alternateName": bank.shortName ?? undefined,
    "logo": bank.logoUrl ?? undefined,
    "url": bank.websiteUrl ?? `https://bankng.vn/bank/${bank.slug}`,
    "description": bank.description ?? `Thông tin ngân hàng ${bank.name}`
  };

  const jsonLd = bank.branches && bank.branches.length > 0
    ? [
        bankSchema,
        ...bank.branches.map((branch: any) => ({
          "@context": "https://schema.org",
          "@type": "FinancialService",
          "name": `${branch.branchName} - ${bank.name}`,
          "parentOrganization": {
            "@type": "BankOrCreditUnion",
            "name": bank.name,
            "logo": bank.logoUrl ?? undefined
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": branch.address ?? undefined,
            "addressLocality": branch.provinceCode ?? undefined,
            "addressCountry": "VN"
          }
        }))
      ]
    : bankSchema;

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <div>
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Ngân hàng" },
              { label: bank.shortName ?? bank.name }
            ]}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <PublicBadge tone="success">{String(bank.shortName ?? bank.name)}</PublicBadge>
            {bank.websiteUrl ? <PublicBadge>{String(bank.websiteUrl)}</PublicBadge> : null}
          </div>
          <h1 className="mt-3 text-3xl font-semibold">{bank.name}</h1>
          <p className="mt-3 max-w-3xl text-sm text-[var(--bankng-text-secondary)]">
            {bank.description ?? "Thông tin ngân hàng đang được hiển thị từ catalog hiện tại."}
          </p>
        </div>

        <Card title="Nguồn dữ liệu & cảnh báo">
          <div className="grid gap-2 text-sm text-[var(--bankng-text-secondary)]">
            <p>Trang chi tiết ngân hàng này được hiển thị từ catalog công khai và dữ liệu chi nhánh hiện có.</p>
            <p>Dữ liệu chi nhánh/lãi suất có thể thay đổi theo khu vực và thời điểm cập nhật.</p>
          </div>
        </Card>

        {filters?.feedback === "lead_created" ? (
          <div className="rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3">
            <div className="font-semibold">Đã ghi nhận yêu cầu</div>
            <div className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
              Yêu cầu kết nối với ngân hàng đã được lưu.
            </div>
          </div>
        ) : filters?.feedback === "lead_duplicate" ? (
          <div className="rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3">
            <div className="font-semibold">Yêu cầu đã tồn tại</div>
            <div className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
              Bạn đã gửi yêu cầu cho ngân hàng này trong vòng 24 giờ qua.
            </div>
          </div>
        ) : null}

        <LeadCtaForm
          contextSlug={slug}
          contextType="bank"
          description="Cần kết nối banker hoặc nhân viên tư vấn của ngân hàng này? Để lại thông tin để đội ngũ tiếp nhận."
          sourcePage={`/bank/${slug}`}
          title="Kết nối tư vấn"
        />

        <Card title="Chi nhánh">
          {bank.branches.length === 0 ? (
            <EmptyState description="Chưa có dữ liệu chi nhánh cho ngân hàng này." title="Không có chi nhánh" />
          ) : (
            <div className="grid gap-3">
              {bank.branches.map((branch: any) => (
                <div className="rounded-md border border-[var(--bankng-border)] p-3" key={branch.id}>
                  <div className="font-medium">{branch.branchName}</div>
                  <div className="text-sm text-[var(--bankng-text-secondary)]">
                    {branch.provinceCode}
                    {branch.districtCode ? ` / ${branch.districtCode}` : ""}
                  </div>
                  {branch.address && (
                    <div className="text-sm text-[var(--bankng-text-secondary)]">{branch.address}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Sản phẩm công khai">
          {bank.products.length === 0 ? (
            <EmptyState description="Ngân hàng này chưa có sản phẩm công khai." title="Không có sản phẩm" />
          ) : (
            <div className="grid gap-3">
              {bank.products.map((product: any) => (
                <div className="rounded-md border border-[var(--bankng-border)] p-4" key={product.id}>
                  <div className="flex flex-wrap gap-2">
                    <PublicBadge>{product.category.name}</PublicBadge>
                    <PublicBadge tone={product.isPublic ? "success" : "warning"}>
                      {product.isPublic ? "Công khai" : String(product.status)}
                    </PublicBadge>
                  </div>
                  <div className="mt-2 font-medium">{product.name}</div>
                  <p className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
                    {product.shortDescription ?? "Chưa có mô tả ngắn."}
                  </p>
                  <div className="mt-3 flex gap-4 text-sm">
                    <Link className="font-medium text-[var(--bankng-primary)] hover:underline" href={`/product/${product.slug}`}>
                      Xem chi tiết sản phẩm
                    </Link>
                    <Link className="text-[var(--bankng-primary)] hover:underline" href={`/compare/${product.category.slug}`}>
                      So sánh danh mục
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
