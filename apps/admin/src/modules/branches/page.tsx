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
      badge="Catalog / Chi nhánh"
      description="Quản lý chi nhánh ngân hàng để map lãi suất theo khu vực."
      feedback={resolveFeedback(params?.feedback)}
      title="Quản lý Chi nhánh"
    >
      <SectionCard title="Tạo chi nhánh mới">
        <form action={createBranchAction} className="grid gap-4">
          <FieldGrid>
            <SelectField label="Ngân hàng" name="bankId" options={bankOptions} />
            <Input label="Mã tỉnh/thành" name="provinceCode" required />
            <Input label="Mã quận/huyện" name="districtCode" />
            <Input label="Tên chi nhánh" name="branchName" required />
            <Input label="Điện thoại" name="phone" />
          </FieldGrid>
          <TextAreaField label="Địa chỉ" name="address" rows={2} />
          <CheckboxField defaultChecked label="Đang hoạt động" name="isActive" />
          <FormActions primaryLabel="Tạo chi nhánh" />
        </form>
      </SectionCard>

      <SectionCard title="Danh sách chi nhánh">
        <DataTable
          headers={["Chi nhánh", "Ngân hàng", "Địa lý", "Số rates", "Thao tác"]}
          rows={branches.map((branch) => (
            <tr key={branch.id}>
              <TableCell>
                <div className="font-medium">{branch.branchName}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">
                  {branch.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
                </div>
              </TableCell>
              <TableCell>{branch.bank.name}</TableCell>
              <TableCell>
                <div>{branch.provinceCode}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">
                  {branch.districtCode ?? "Không có quận"} / {branch.address ?? "Không có địa chỉ"}
                </div>
              </TableCell>
              <TableCell>{branch._count.rates}</TableCell>
              <TableCell>
                <form action={updateBranchAction} className="grid gap-2">
                  <input name="id" type="hidden" value={branch.id} />
                  <SelectField defaultValue={branch.bankId} label="Ngân hàng" name="bankId" options={bankOptions} />
                  <Input defaultValue={branch.provinceCode} label="Mã tỉnh/thành" name="provinceCode" required />
                  <Input defaultValue={branch.districtCode ?? ""} label="Mã quận/huyện" name="districtCode" />
                  <Input defaultValue={branch.branchName} label="Tên chi nhánh" name="branchName" required />
                  <Input defaultValue={branch.phone ?? ""} label="Điện thoại" name="phone" />
                  <TextAreaField defaultValue={branch.address} label="Địa chỉ" name="address" rows={2} />
                  <CheckboxField defaultChecked={branch.isActive} label="Đang hoạt động" name="isActive" />
                  <FormActions
                    primaryLabel="Lưu chi nhánh"
                    secondary={
                      branch._count.rates === 0 ? (
                        <button
                          className="rounded-md border border-[var(--bankng-border)] px-3 py-2 text-sm text-red-600"
                          formAction={deleteBranchAction}
                          type="submit"
                        >
                          Xóa chi nhánh
                        </button>
                      ) : (
                        <span className="text-xs text-[var(--bankng-text-secondary)]">
                          Còn rates liên kết.
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
