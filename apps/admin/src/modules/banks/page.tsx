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
      badge="Catalog / Banks"
      description="Quan ly danh muc ngan hang. Mutation tai day se tao audit log."
      feedback={resolveFeedback(params?.feedback)}
      title="Banks CRUD"
    >
      <SectionCard
        description="Tao bank moi de dung cho products, variants va rates."
        title="Tao ngan hang"
      >
        <form action={createBankAction} className="grid gap-4">
          <FieldGrid>
            <Input label="Ten ngan hang" name="name" required />
            <Input label="Short name" name="shortName" />
            <Input label="Website" name="websiteUrl" type="url" />
            <Input label="Hotline" name="hotline" />
            <Input label="Logo URL" name="logoUrl" type="url" />
          </FieldGrid>
          <TextAreaField label="Mo ta" name="description" />
          <CheckboxField defaultChecked label="Dang hoat dong" name="isActive" />
          <FormActions primaryLabel="Tao bank" />
        </form>
      </SectionCard>

      <SectionCard title="Danh sach ngan hang">
        <DataTable
          headers={["Bank", "Thong tin", "Trang thai", "Cap nhat", "Thao tac"]}
          rows={banks.map((bank) => (
            <tr key={bank.id}>
              <TableCell>
                <div className="font-medium">{bank.name}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">{bank.slug}</div>
              </TableCell>
              <TableCell>
                <div>Products: {bank._count.products}</div>
                <div>Branches: {bank._count.branches}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">
                  {bank.websiteUrl ?? "No website"}
                </div>
              </TableCell>
              <TableCell>{bank.isActive ? "Active" : "Inactive"}</TableCell>
              <TableCell>{bank.updatedAt.toISOString().slice(0, 10)}</TableCell>
              <TableCell>
                <form action={updateBankAction} className="grid gap-2">
                  <input name="id" type="hidden" value={bank.id} />
                  <Input defaultValue={bank.name} label="Ten" name="name" required />
                  <Input defaultValue={bank.shortName ?? ""} label="Short" name="shortName" />
                  <Input defaultValue={bank.websiteUrl ?? ""} label="Website" name="websiteUrl" />
                  <Input defaultValue={bank.hotline ?? ""} label="Hotline" name="hotline" />
                  <Input defaultValue={bank.logoUrl ?? ""} label="Logo" name="logoUrl" />
                  <TextAreaField defaultValue={bank.description} label="Mo ta" name="description" rows={3} />
                  <CheckboxField defaultChecked={bank.isActive} label="Dang hoat dong" name="isActive" />
                  <FormActions
                    primaryLabel="Luu"
                    secondary={
                      bank._count.products === 0 && bank._count.branches === 0 ? (
                        <button
                          className="rounded-md border border-[var(--bankng-border)] px-3 py-2 text-sm"
                          formAction={deleteBankAction}
                          type="submit"
                        >
                          Xoa
                        </button>
                      ) : (
                        <span className="text-xs text-[var(--bankng-text-secondary)]">
                          Khong xoa duoc khi con lien ket.
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
