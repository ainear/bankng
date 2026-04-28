import { prisma } from "@bankng/db";
import { AdminPage, CheckboxField, DataTable, FieldGrid, FormActions, Input, SectionCard, TableCell, TextAreaField } from "../shared/page-ui";
import { createCategoryAction, deleteCategoryAction, updateCategoryAction } from "./actions";
import { resolveFeedback } from "../shared/server/feedback";

export default async function CategoriesPage({
  searchParams
}: {
  searchParams?: Promise<{ feedback?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const categories = await prisma.productCategory.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <AdminPage
      badge="Catalog / Categories"
      description="Quan ly product categories cho compare pages va catalog."
      feedback={resolveFeedback(params?.feedback)}
      title="Categories CRUD"
    >
      <SectionCard title="Tao category moi">
        <form action={createCategoryAction} className="grid gap-4">
          <FieldGrid>
            <Input label="Ten category" name="name" required />
            <Input label="Slug (optional)" name="slug" />
          </FieldGrid>
          <TextAreaField label="Mo ta" name="description" />
          <div className="flex flex-wrap gap-3">
            <CheckboxField defaultChecked label="Compare enabled" name="compareEnabled" />
            <CheckboxField defaultChecked label="Dang hoat dong" name="isActive" />
          </div>
          <FormActions primaryLabel="Tao category" />
        </form>
      </SectionCard>

      <SectionCard title="Danh sach categories">
        <DataTable
          headers={["Category", "So san pham", "Flags", "Cap nhat", "Thao tac"]}
          rows={categories.map((category) => (
            <tr key={category.id}>
              <TableCell>
                <div className="font-medium">{category.name}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">{category.slug}</div>
              </TableCell>
              <TableCell>{category._count.products}</TableCell>
              <TableCell>
                <div>Compare: {category.compareEnabled ? "On" : "Off"}</div>
                <div>Active: {category.isActive ? "Yes" : "No"}</div>
              </TableCell>
              <TableCell>{category.updatedAt.toISOString().slice(0, 10)}</TableCell>
              <TableCell>
                <form action={updateCategoryAction} className="grid gap-2">
                  <input name="id" type="hidden" value={category.id} />
                  <Input defaultValue={category.name} label="Ten" name="name" required />
                  <Input defaultValue={category.slug} label="Slug" name="slug" />
                  <TextAreaField defaultValue={category.description} label="Mo ta" name="description" rows={3} />
                  <div className="flex flex-wrap gap-3">
                    <CheckboxField
                      defaultChecked={category.compareEnabled}
                      label="Compare enabled"
                      name="compareEnabled"
                    />
                    <CheckboxField defaultChecked={category.isActive} label="Dang hoat dong" name="isActive" />
                  </div>
                  <FormActions
                    primaryLabel="Luu"
                    secondary={
                      category._count.products === 0 ? (
                        <button
                          className="rounded-md border border-[var(--bankng-border)] px-3 py-2 text-sm"
                          formAction={deleteCategoryAction}
                          type="submit"
                        >
                          Xoa
                        </button>
                      ) : (
                        <span className="text-xs text-[var(--bankng-text-secondary)]">
                          Con san pham lien ket.
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
