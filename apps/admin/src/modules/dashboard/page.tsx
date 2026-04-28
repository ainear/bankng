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
      description="M2 da mo banks, categories, products/variants, rates va audit logs."
      title="Bang dieu khien van hanh"
    >
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-8">
        <SummaryTile hint="Danh muc ngan hang" label="Banks" value={banks} />
        <SummaryTile hint="Chi nhanh ngan hang" label="Branches" value={branches} />
        <SummaryTile hint="Loai san pham" label="Categories" value={categories} />
        <SummaryTile hint="Financial products" label="Products" value={products} />
        <SummaryTile hint="Variants duoc gan rates" label="Variants" value={variants} />
        <SummaryTile hint="Rate snapshots" label="Rates" value={rates} />
        <SummaryTile hint="Lead tu funnel public" label="Leads" value={leads} />
        <SummaryTile hint="Mutation nhay cam" label="Audit logs" value={logs} />
      </div>
    </AdminPage>
  );
}
