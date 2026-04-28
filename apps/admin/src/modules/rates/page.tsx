import { prisma } from "@bankng/db";
import {
  AdminPage,
  DataTable,
  FieldGrid,
  FormActions,
  Input,
  SectionCard,
  SelectField,
  TableCell
} from "../shared/page-ui";
import {
  createRateAction,
  createRateSourceAction,
  deleteRateAction,
  deleteRateSourceAction,
  expireRateAction,
  rejectRateAction,
  updateRateAction,
  updateRateSourceAction,
  verifyRateAction
} from "./actions";
import { getFreshnessIndicator } from "./freshness";
import { resolveFeedback } from "../shared/server/feedback";

export default async function RatesPage({
  searchParams
}: {
  searchParams?: Promise<{ feedback?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const [variants, sources, branches, rates] = await Promise.all([
    prisma.productVariant.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: true
      }
    }),
    prisma.rateSource.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { rates: true }
        }
      }
    }),
    prisma.bankBranch.findMany({
      orderBy: [{ bank: { name: "asc" } }, { branchName: "asc" }],
      include: {
        bank: true
      }
    }),
    prisma.interestRateSnapshot.findMany({
      orderBy: { effectiveFrom: "desc" },
      include: {
        productVariant: {
          include: {
            product: true
          }
        },
        source: true,
        verifications: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            verifier: {
              select: {
                email: true
              }
            }
          }
        }
      }
    })
  ]);

  const variantOptions = variants.map((variant) => ({
    label: `${variant.product.name} / ${variant.variantName}`,
    value: variant.id
  }));
  const sourceOptions = sources.map((source) => ({
    label: `${source.sourceName} (${source.sourceType})`,
    value: source.id
  }));
  const branchOptions = [
    { label: "No branch", value: "" },
    ...branches.map((branch) => ({
      label: `${branch.bank.name} / ${branch.branchName} (${branch.provinceCode})`,
      value: branch.id
    }))
  ];
  const rateStatusOptions = [
    { label: "pending", value: "pending" },
    { label: "verified", value: "verified" },
    { label: "rejected", value: "rejected" },
    { label: "expired", value: "expired" }
  ];
  const now = new Date();

  return (
    <AdminPage
      badge="Catalog / Rates"
      description="Quan ly rate sources va interest rate snapshots. Moi mutation deu ghi audit log."
      feedback={resolveFeedback(params?.feedback)}
      title="Rates CRUD"
    >
      <SectionCard title="Tao rate source">
        <form action={createRateSourceAction} className="grid gap-4">
          <FieldGrid>
            <Input label="Source type" name="sourceType" required />
            <Input label="Source name" name="sourceName" required />
            <Input label="Source URL" name="sourceUrl" type="url" />
            <Input defaultValue="50" label="Reliability score" name="reliabilityScore" type="number" />
          </FieldGrid>
          <FormActions primaryLabel="Tao source" />
        </form>
      </SectionCard>

      <SectionCard title="Tao rate snapshot">
        <form action={createRateAction} className="grid gap-4">
          <FieldGrid>
            <SelectField label="Variant" name="productVariantId" options={variantOptions} />
            <SelectField label="Branch" name="branchId" options={branchOptions} />
            <SelectField label="Source" name="sourceId" options={sourceOptions} />
            <SelectField label="Status" name="status" options={rateStatusOptions} />
            <Input label="Rate type" name="rateType" required />
            <Input defaultValue="6" label="Term value" name="termValue" type="number" />
            <Input defaultValue="month" label="Term unit" name="termUnit" />
            <Input defaultValue="6" label="Rate value" name="rateValue" step="0.01" type="number" />
            <Input defaultValue="percent_per_year" label="Rate unit" name="rateUnit" />
            <Input label="Province code" name="provinceCode" />
            <Input label="Min amount" name="minAmount" type="number" />
            <Input label="Max amount" name="maxAmount" type="number" />
            <Input defaultValue={new Date().toISOString().slice(0, 10)} label="Effective from" name="effectiveFrom" type="date" />
            <Input label="Effective to" name="effectiveTo" type="date" />
          </FieldGrid>
          <FormActions primaryLabel="Tao rate" />
        </form>
      </SectionCard>

      <SectionCard title="Rate sources">
        <DataTable
          headers={["Source", "Reliability", "Lien ket", "Thao tac"]}
          rows={sources.map((source) => (
            <tr key={source.id}>
              <TableCell>
                <div className="font-medium">{source.sourceName}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">{source.sourceType}</div>
              </TableCell>
              <TableCell>{source.reliabilityScore}</TableCell>
              <TableCell>{source._count.rates} rates</TableCell>
              <TableCell>
                <form action={updateRateSourceAction} className="grid gap-2">
                  <input name="id" type="hidden" value={source.id} />
                  <Input defaultValue={source.sourceType} label="Type" name="sourceType" required />
                  <Input defaultValue={source.sourceName} label="Name" name="sourceName" required />
                  <Input defaultValue={source.sourceUrl ?? ""} label="URL" name="sourceUrl" />
                  <Input
                    defaultValue={source.reliabilityScore.toString()}
                    label="Reliability"
                    name="reliabilityScore"
                    type="number"
                  />
                  <FormActions
                    primaryLabel="Luu source"
                    secondary={
                      source._count.rates === 0 ? (
                        <button
                          className="rounded-md border border-[var(--bankng-border)] px-3 py-2 text-sm"
                          formAction={deleteRateSourceAction}
                          type="submit"
                        >
                          Xoa source
                        </button>
                      ) : (
                        <span className="text-xs text-[var(--bankng-text-secondary)]">
                          Con rates lien ket.
                        </span>
                      )
                    }
                  />
                </form>
              </TableCell>
            </tr>
          ))}
        />
      </SectionCard>

      <SectionCard title="Rate snapshots">
        <DataTable
          headers={["Variant", "Rate", "Nguon/Freshness", "Hieu luc", "Thao tac"]}
          rows={rates.map((rate) => {
            const freshness = getFreshnessIndicator({
              status: rate.status,
              effectiveFrom: rate.effectiveFrom,
              updatedAt: rate.updatedAt,
              now,
              reliabilityScore: rate.source.reliabilityScore
            });
            const latestVerification = rate.verifications[0];

            return (
              <tr key={rate.id}>
              <TableCell>
                <div className="font-medium">{rate.productVariant.product.name}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">{rate.productVariant.variantName}</div>
              </TableCell>
              <TableCell>
                <div>
                  {rate.rateValue.toString()} {rate.rateUnit}
                </div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">
                  {rate.rateType} / {rate.termValue ?? "-"} {rate.termUnit ?? ""}
                </div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">
                  Branch: {rate.branchId ? branches.find((branch) => branch.id === rate.branchId)?.branchName ?? "Unknown" : "No branch"}
                </div>
              </TableCell>
              <TableCell>
                <div>{rate.source.sourceName}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">{rate.status}</div>
                <div
                  className="mt-1 inline-flex rounded-md border border-[var(--bankng-border)] px-2 py-1 text-xs"
                  data-freshness-tone={freshness.tone}
                >
                  {freshness.label}
                </div>
                <div className="mt-1 text-xs text-[var(--bankng-text-secondary)]">
                  {freshness.description}
                </div>
                <div className="mt-1 text-xs text-[var(--bankng-text-secondary)]">
                  Reliability: {rate.source.reliabilityScore}
                </div>
                {latestVerification ? (
                  <div className="mt-1 text-xs text-[var(--bankng-text-secondary)]">
                    Last review: {latestVerification.verdict} by {latestVerification.verifier.email}
                  </div>
                ) : (
                  <div className="mt-1 text-xs text-[var(--bankng-text-secondary)]">Chua co verification log.</div>
                )}
              </TableCell>
              <TableCell>
                <div>{rate.effectiveFrom.toISOString().slice(0, 10)}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">
                  {rate.effectiveTo ? rate.effectiveTo.toISOString().slice(0, 10) : "Open ended"}
                </div>
              </TableCell>
              <TableCell>
                <form action={updateRateAction} className="grid gap-2">
                  <input name="id" type="hidden" value={rate.id} />
                  <SelectField
                    defaultValue={rate.productVariantId}
                    label="Variant"
                    name="productVariantId"
                    options={variantOptions}
                  />
                  <SelectField
                    defaultValue={rate.branchId ?? ""}
                    label="Branch"
                    name="branchId"
                    options={branchOptions}
                  />
                  <SelectField defaultValue={rate.sourceId} label="Source" name="sourceId" options={sourceOptions} />
                  <SelectField defaultValue={rate.status} label="Status" name="status" options={rateStatusOptions} />
                  <Input defaultValue={rate.rateType} label="Rate type" name="rateType" required />
                  <Input defaultValue={rate.termValue?.toString() ?? ""} label="Term value" name="termValue" type="number" />
                  <Input defaultValue={rate.termUnit ?? ""} label="Term unit" name="termUnit" />
                  <Input defaultValue={rate.rateValue.toString()} label="Rate value" name="rateValue" step="0.01" type="number" />
                  <Input defaultValue={rate.rateUnit} label="Rate unit" name="rateUnit" />
                  <Input defaultValue={rate.provinceCode ?? ""} label="Province code" name="provinceCode" />
                  <Input defaultValue={rate.minAmount?.toString() ?? ""} label="Min amount" name="minAmount" type="number" />
                  <Input defaultValue={rate.maxAmount?.toString() ?? ""} label="Max amount" name="maxAmount" type="number" />
                  <Input
                    defaultValue={rate.effectiveFrom.toISOString().slice(0, 10)}
                    label="Effective from"
                    name="effectiveFrom"
                    type="date"
                  />
                  <Input
                    defaultValue={rate.effectiveTo?.toISOString().slice(0, 10) ?? ""}
                    label="Effective to"
                    name="effectiveTo"
                    type="date"
                  />
                  <Input
                    defaultValue={latestVerification?.note ?? ""}
                    label="Verification note"
                    name="verificationNote"
                  />
                  <FormActions
                    primaryLabel="Luu rate"
                    secondary={
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="rounded-md border border-[var(--bankng-border)] px-3 py-2 text-sm"
                          formAction={verifyRateAction}
                          type="submit"
                        >
                          Verify
                        </button>
                        <button
                          className="rounded-md border border-[var(--bankng-border)] px-3 py-2 text-sm"
                          formAction={rejectRateAction}
                          type="submit"
                        >
                          Reject
                        </button>
                        <button
                          className="rounded-md border border-[var(--bankng-border)] px-3 py-2 text-sm"
                          formAction={expireRateAction}
                          type="submit"
                        >
                          Expire
                        </button>
                        <button
                          className="rounded-md border border-[var(--bankng-border)] px-3 py-2 text-sm"
                          formAction={deleteRateAction}
                          type="submit"
                        >
                          Xoa rate
                        </button>
                      </div>
                    }
                  />
                </form>
              </TableCell>
              </tr>
            );
          })}
        />
      </SectionCard>
    </AdminPage>
  );
}
