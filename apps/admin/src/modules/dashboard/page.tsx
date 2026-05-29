import { prisma } from "@bankng/db";
import { AdminPage, SummaryTile } from "@/modules/shared/page-ui";

export default async function DashboardPage() {
  const [banks, branches, categories, products, variants, rates, leads, logs] = await Promise.all([
    prisma.bank.count(),
    prisma.bankBranch.count(),
    prisma.productCategory.count(),
    prisma.financialProduct.count(),
    prisma.productVariant.count(),
    prisma.interestRateSnapshot.count(),
    prisma.lead.count(),
    prisma.auditLog.count()
  ]);

  return (
    <AdminPage
      badge="Admin / Dashboard"
      description="Quản lý ngân hàng, sản phẩm, lãi suất, leads và audit logs."
      title="Bảng điều khiển vận hành"
    >
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-8">
        <SummaryTile hint="Danh mục ngân hàng" label="Ngân hàng" value={banks} />
        <SummaryTile hint="Chi nhánh ngân hàng" label="Chi nhánh" value={branches} />
        <SummaryTile hint="Loại sản phẩm" label="Danh mục" value={categories} />
        <SummaryTile hint="Financial products" label="Sản phẩm" value={products} />
        <SummaryTile hint="Variants được gắn rates" label="Biến thể" value={variants} />
        <SummaryTile hint="Rate snapshots" label="Lãi suất" value={rates} />
        <SummaryTile hint="Lead từ funnel public" label="Leads" value={leads} />
        <SummaryTile hint="Mutation nhạy cảm" label="Audit logs" value={logs} />
      </div>
    </AdminPage>
  );
}
