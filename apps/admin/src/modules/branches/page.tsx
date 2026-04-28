import { prisma } from "@bankng/db";
import {
  AdminPage,
  CheckboxField,
  DataTable,
  FieldGrid,
  FormActions,
  Input,
  SectionCard,
  SelectField,
  TableCell,
  TextAreaField
} from "../shared/page-ui";
import { createBranchAction, deleteBranchAction, updateBranchAction } from "./actions";
import { resolveFeedback } from "../shared/server/feedback";

export default async function BranchesPage({
  searchParams
}: {
  searchParams?: Promise<{ feedback?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const [banks, branches] = await Promise.all([
    prisma.bank.findMany({ orderBy: { name: "asc" } }),
    prisma.bankBranch.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        bank: true,
        _count: {
          select: { rates: true }
        }
      }
    })
  ]);

  const bankOptions = banks.map((bank) => ({ label: bank.name, value: bank.id }));

  return (
    <AdminPage
      badge="Catalog / Branches"
      description="Quan ly chi nhanh ngan hang de map rates theo khu vuc."
      feedback={resolveFeedback(params?.feedback)}
      title="Branches CRUD"
    >
      <SectionCard title="Tao branch moi">
        <form action={createBranchAction} className="grid gap-4">
          <FieldGrid>
            <SelectField label="Bank" name="bankId" options={bankOptions} />
            <Input label="Province code" name="provinceCode" required />
            <Input label="District code" name="districtCode" />
            <Input label="Ten chi nhanh" name="branchName" required />
            <Input label="Phone" name="phone" />
          </FieldGrid>
          <TextAreaField label="Address" name="address" rows={2} />
          <CheckboxField defaultChecked label="Dang hoat dong" name="isActive" />
          <FormActions primaryLabel="Tao branch" />
        </form>
      </SectionCard>

      <SectionCard title="Danh sach branches">
        <DataTable
          headers={["Branch", "Bank", "Dia ly", "Rates", "Thao tac"]}
          rows={branches.map((branch) => (
            <tr key={branch.id}>
              <TableCell>
                <div className="font-medium">{branch.branchName}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">
                  {branch.isActive ? "Active" : "Inactive"}
                </div>
              </TableCell>
              <TableCell>{branch.bank.name}</TableCell>
              <TableCell>
                <div>{branch.provinceCode}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">
                  {branch.districtCode ?? "No district"} / {branch.address ?? "No address"}
                </div>
              </TableCell>
              <TableCell>{branch._count.rates}</TableCell>
              <TableCell>
                <form action={updateBranchAction} className="grid gap-2">
                  <input name="id" type="hidden" value={branch.id} />
                  <SelectField defaultValue={branch.bankId} label="Bank" name="bankId" options={bankOptions} />
                  <Input defaultValue={branch.provinceCode} label="Province code" name="provinceCode" required />
                  <Input defaultValue={branch.districtCode ?? ""} label="District code" name="districtCode" />
                  <Input defaultValue={branch.branchName} label="Ten chi nhanh" name="branchName" required />
                  <Input defaultValue={branch.phone ?? ""} label="Phone" name="phone" />
                  <TextAreaField defaultValue={branch.address} label="Address" name="address" rows={2} />
                  <CheckboxField defaultChecked={branch.isActive} label="Dang hoat dong" name="isActive" />
                  <FormActions
                    primaryLabel="Luu branch"
                    secondary={
                      branch._count.rates === 0 ? (
                        <button
                          className="rounded-md border border-[var(--bankng-border)] px-3 py-2 text-sm"
                          formAction={deleteBranchAction}
                          type="submit"
                        >
                          Xoa branch
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
    </AdminPage>
  );
}
