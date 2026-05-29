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
      description="Quản lý danh mục sản phẩm cho compare pages và catalog."
      feedback={resolveFeedback(params?.feedback)}
      title="Categories CRUD"
    >
      <SectionCard title="Tạo danh mục mới">
        <form action={createCategoryAction} className="grid gap-4">
          <FieldGrid>
            <Input label="Tên danh mục" name="name" required />
            <Input label="Slug (optional)" name="slug" />
          </FieldGrid>
          <TextAreaField label="Mô tả" name="description" />
          <div className="flex flex-wrap gap-3">
            <CheckboxField defaultChecked label="Compare enabled" name="compareEnabled" />
            <CheckboxField defaultChecked label="Đang hoạt động" name="isActive" />
          </div>
          <FormActions primaryLabel="Tạo danh mục" />
        </form>
      </SectionCard>

      <SectionCard title="Danh sách danh mục">
        <DataTable
          headers={["Danh mục", "Số sản phẩm", "Flags", "Cập nhật", "Thao tác"]}
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
                  <Input defaultValue={category.name} label="Tên" name="name" required />
                  <Input defaultValue={category.slug} label="Slug" name="slug" />
                  <TextAreaField defaultValue={category.description} label="Mô tả" name="description" rows={3} />
                  <div className="flex flex-wrap gap-3">
                    <CheckboxField
                      defaultChecked={category.compareEnabled}
                      label="Compare enabled"
                      name="compareEnabled"
                    />
                    <CheckboxField defaultChecked={category.isActive} label="Đang hoạt động" name="isActive" />
                  </div>
                  <FormActions
                    primaryLabel="Lưu"
                    secondary={
                      category._count.products === 0 ? (
                        <button
                          className="rounded-md border border-[var(--bankng-border)] px-3 py-2 text-sm"
                          formAction={deleteCategoryAction}
                          type="submit"
                        >
                          Xóa
                        </button>
                      ) : (
                        <span className="text-xs text-[var(--bankng-text-secondary)]">
                          Còn sản phẩm liên kết.
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
