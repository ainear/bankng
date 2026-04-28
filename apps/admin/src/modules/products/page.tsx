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
import {
  createProductAction,
  createVariantAction,
  deleteProductAction,
  deleteVariantAction,
  updateProductAction,
  updateVariantAction
} from "./actions";
import { resolveFeedback } from "../shared/server/feedback";

export default async function ProductsPage({
  searchParams
}: {
  searchParams?: Promise<{ feedback?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const [banks, categories, products] = await Promise.all([
    prisma.bank.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.productCategory.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.financialProduct.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        bank: true,
        category: true,
        variants: {
          orderBy: { createdAt: "desc" },
          include: {
            _count: {
              select: { rates: true }
            }
          }
        },
        _count: {
          select: { variants: true }
        }
      }
    })
  ]);

  const bankOptions = banks.map((bank) => ({ label: bank.name, value: bank.id }));
  const categoryOptions = categories.map((category) => ({ label: category.name, value: category.id }));
  const productOptions = products.map((product) => ({ label: product.name, value: product.id }));
  const statusOptions = [
    { label: "draft", value: "draft" },
    { label: "active", value: "active" },
    { label: "archived", value: "archived" }
  ];

  return (
    <AdminPage
      badge="Catalog / Products"
      description="Quan ly products va variants. Product la lop public, variant la lop dung cho rates va dieu kien."
      feedback={resolveFeedback(params?.feedback)}
      title="Products & Variants CRUD"
    >
      <SectionCard title="Tao product moi">
        <form action={createProductAction} className="grid gap-4">
          <FieldGrid>
            <SelectField label="Bank" name="bankId" options={bankOptions} />
            <SelectField label="Category" name="categoryId" options={categoryOptions} />
            <SelectField label="Status" name="status" options={statusOptions} />
            <Input label="Ten product" name="name" required />
            <Input label="Slug (optional)" name="slug" />
            <Input label="Ranking score" name="rankingScore" type="number" />
            <Input label="Featured rank" name="featuredRank" type="number" />
          </FieldGrid>
          <TextAreaField label="Short description" name="shortDescription" rows={2} />
          <TextAreaField label="Long description" name="longDescription" />
          <CheckboxField label="Public" name="isPublic" />
          <FormActions primaryLabel="Tao product" />
        </form>
      </SectionCard>

      <SectionCard title="Tao variant moi">
        <form action={createVariantAction} className="grid gap-4">
          <FieldGrid>
            <SelectField label="Product" name="productId" options={productOptions} />
            <Input label="Ten variant" name="variantName" required />
            <Input label="Slug (optional)" name="slug" />
            <SelectField label="Status" name="status" options={statusOptions} />
            <Input label="Target segment" name="targetSegment" />
            <Input label="Min amount" name="minAmount" type="number" />
            <Input label="Max amount" name="maxAmount" type="number" />
            <Input label="Min term (month)" name="minTermMonth" type="number" />
            <Input label="Max term (month)" name="maxTermMonth" type="number" />
          </FieldGrid>
          <div className="flex flex-wrap gap-3">
            <CheckboxField label="Collateral required" name="collateralRequired" />
          </div>
          <TextAreaField label="Income requirement" name="incomeRequirement" rows={2} />
          <TextAreaField label="Note" name="note" rows={2} />
          <FormActions primaryLabel="Tao variant" />
        </form>
      </SectionCard>

      <SectionCard title="Danh sach products">
        <DataTable
          headers={["Product", "Category / Bank", "Status", "Variants", "Thao tac"]}
          rows={products.map((product) => (
            <tr key={product.id}>
              <TableCell>
                <div className="font-medium">{product.name}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">{product.slug}</div>
              </TableCell>
              <TableCell>
                <div>{product.category.name}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">{product.bank.name}</div>
              </TableCell>
              <TableCell>
                <div>{product.status}</div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">
                  Public: {product.isPublic ? "Yes" : "No"}
                </div>
              </TableCell>
              <TableCell>
                <div>{product._count.variants} variants</div>
                <div className="mt-2 grid gap-2">
                  {product.variants.map((variant) => (
                    <form action={updateVariantAction} className="rounded-md border border-[var(--bankng-border)] p-3" key={variant.id}>
                      <input name="id" type="hidden" value={variant.id} />
                      <input name="productId" type="hidden" value={product.id} />
                      <div className="grid gap-2 md:grid-cols-2">
                        <Input defaultValue={variant.variantName} label="Variant" name="variantName" required />
                        <Input defaultValue={variant.slug} label="Slug" name="slug" />
                        <Input defaultValue={variant.targetSegment ?? ""} label="Segment" name="targetSegment" />
                        <SelectField
                          defaultValue={variant.status}
                          label="Status"
                          name="status"
                          options={statusOptions}
                        />
                        <Input defaultValue={variant.minAmount?.toString() ?? ""} label="Min amount" name="minAmount" type="number" />
                        <Input defaultValue={variant.maxAmount?.toString() ?? ""} label="Max amount" name="maxAmount" type="number" />
                        <Input defaultValue={variant.minTermMonth?.toString() ?? ""} label="Min term" name="minTermMonth" type="number" />
                        <Input defaultValue={variant.maxTermMonth?.toString() ?? ""} label="Max term" name="maxTermMonth" type="number" />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <CheckboxField
                          defaultChecked={variant.collateralRequired ?? false}
                          label="Collateral required"
                          name="collateralRequired"
                        />
                        <span className="text-xs text-[var(--bankng-text-secondary)]">
                          Rates: {variant._count.rates}
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2">
                        <TextAreaField
                          defaultValue={variant.incomeRequirement}
                          label="Income requirement"
                          name="incomeRequirement"
                          rows={2}
                        />
                        <TextAreaField defaultValue={variant.note} label="Note" name="note" rows={2} />
                      </div>
                      <div className="mt-3">
                        <FormActions
                          primaryLabel="Luu variant"
                          secondary={
                            variant._count.rates === 0 ? (
                              <button
                                className="rounded-md border border-[var(--bankng-border)] px-3 py-2 text-sm"
                                formAction={deleteVariantAction}
                                type="submit"
                              >
                                Xoa variant
                              </button>
                            ) : (
                              <span className="text-xs text-[var(--bankng-text-secondary)]">
                                Con rates lien ket.
                              </span>
                            )
                          }
                        />
                      </div>
                    </form>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <form action={updateProductAction} className="grid gap-2">
                  <input name="id" type="hidden" value={product.id} />
                  <SelectField defaultValue={product.bankId} label="Bank" name="bankId" options={bankOptions} />
                  <SelectField
                    defaultValue={product.categoryId}
                    label="Category"
                    name="categoryId"
                    options={categoryOptions}
                  />
                  <SelectField defaultValue={product.status} label="Status" name="status" options={statusOptions} />
                  <Input defaultValue={product.name} label="Ten" name="name" required />
                  <Input defaultValue={product.slug} label="Slug" name="slug" />
                  <Input defaultValue={product.rankingScore?.toString() ?? ""} label="Ranking score" name="rankingScore" type="number" />
                  <Input defaultValue={product.featuredRank?.toString() ?? ""} label="Featured rank" name="featuredRank" type="number" />
                  <CheckboxField defaultChecked={product.isPublic} label="Public" name="isPublic" />
                  <TextAreaField
                    defaultValue={product.shortDescription}
                    label="Short description"
                    name="shortDescription"
                    rows={2}
                  />
                  <TextAreaField
                    defaultValue={product.longDescription}
                    label="Long description"
                    name="longDescription"
                    rows={3}
                  />
                  <FormActions
                    primaryLabel="Luu product"
                    secondary={
                      product._count.variants === 0 ? (
                        <button
                          className="rounded-md border border-[var(--bankng-border)] px-3 py-2 text-sm"
                          formAction={deleteProductAction}
                          type="submit"
                        >
                          Xoa product
                        </button>
                      ) : (
                        <span className="text-xs text-[var(--bankng-text-secondary)]">
                          Con variants lien ket.
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
