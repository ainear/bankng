import { prisma } from "@bankng/db";
import { AdminPage, CheckboxField, DataTable, FieldGrid, FormActions, Input, SectionCard, TableCell, TextAreaField } from "../shared/page-ui";
import { createBankAction, deleteBankAction, updateBankAction } from "./actions";
import { resolveFeedback } from "../shared/server/feedback";

export default async function BanksPage({
  searchParams
}: {
  searchParams?: Promise<{ feedback?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const banks = await prisma.bank.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { products: true, branches: true }
      }
    }
  });

  return (
    <AdminPage
      badge="Catalog / Ngân hàng"
      description="Quản lý danh mục ngân hàng. Thảo tác tại đây sẽ tạo audit log."
      feedback={resolveFeedback(params?.feedback)}
      title="Quản lý Ngân hàng"
    >
      <SectionCard
        description="Tạo ngân hàng mới để gán cho sản phẩm, biến thể và lãi suất."
        title="Tạo ngân hàng mới"
      >
        <form action={createBankAction} className="grid gap-4">
          <FieldGrid>
            <Input label="Tên ngân hàng" name="name" required />
            <Input label="Tên viết tắt" name="shortName" />
            <Input label="Website" name="websiteUrl" type="url" />
            <Input label="Hotline" name="hotline" />
            <Input label="URL Logo" name="logoUrl" type="url" />
          </FieldGrid>
          <TextAreaField label="Mô tả" name="description" />
          <CheckboxField defaultChecked label="Đang hoạt động" name="isActive" />
          <FormActions primaryLabel="Tạo ngân hàng" />
        </form>
      </SectionCard>

      <SectionCard title="Danh sách ngân hàng">
        <DataTable
          headers={["Ngân hàng", "Thông tin", "Trạng thái", "Cập nhật", "Thảo tác"]}
          rows={banks.map((bank) => (
            <tr key={bank.id}>
              <TableCell>
                <div className="font-medium">{bank.name}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">{bank.slug}</div>
              </TableCell>
              <TableCell>
                <div>Sản phẩm: {bank._count.products}</div>
                <div>Chi nhánh: {bank._count.branches}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">
                  {bank.websiteUrl ?? "Chưa có website"}
                </div>
              </TableCell>
              <TableCell>{bank.isActive ? "Đang hoạt động" : "Tạm ngưng"}</TableCell>
              <TableCell>{bank.updatedAt.toISOString().slice(0, 10)}</TableCell>
              <TableCell>
                <form action={updateBankAction} className="grid gap-2">
                  <input name="id" type="hidden" value={bank.id} />
                  <Input defaultValue={bank.name} label="Tên" name="name" required />
                  <Input defaultValue={bank.shortName ?? ""} label="Viết tắt" name="shortName" />
                  <Input defaultValue={bank.websiteUrl ?? ""} label="Website" name="websiteUrl" />
                  <Input defaultValue={bank.hotline ?? ""} label="Hotline" name="hotline" />
                  <Input defaultValue={bank.logoUrl ?? ""} label="Logo URL" name="logoUrl" />
                  <TextAreaField defaultValue={bank.description} label="Mô tả" name="description" rows={3} />
                  <CheckboxField defaultChecked={bank.isActive} label="Đang hoạt động" name="isActive" />
                  <FormActions
                    primaryLabel="Lưu"
                    secondary={
                      bank._count.products === 0 && bank._count.branches === 0 ? (
                        <button
                          className="rounded-md border border-[var(--bankng-border)] px-3 py-2 text-sm"
                          formAction={deleteBankAction}
                          type="submit"
                        >
                          Xóa
                        </button>
                      ) : (
                        <span className="text-xs text-[var(--bankng-text-secondary)]">
                          Không thể xóa khi còn liên kết.
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
