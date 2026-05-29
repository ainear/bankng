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
  TextAreaField,
} from "../shared/page-ui";
import {
  createArticleCategoryAction,
  createArticleAction,
  deleteArticleCategoryAction,
  deleteArticleAction,
  publishArticleAction,
  unpublishArticleAction,
  updateArticleCategoryAction,
  updateArticleAction,
} from "./actions";
import { resolveFeedback } from "../shared/server/feedback";

export const dynamic = "force-dynamic";

const STATUS_OPTIONS = [
  { label: "Bản nháp", value: "draft" },
  { label: "Đã đăng", value: "active" },
  { label: "Lưu trữ", value: "archived" },
];

function statusLabel(status: string) {
  return STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

function statusBadgeClass(status: string) {
  if (status === "active") return "bg-emerald-100 text-emerald-700";
  if (status === "archived") return "bg-gray-100 text-gray-600";
  return "bg-amber-100 text-amber-700";
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams?: Promise<{ feedback?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;

  const [categories, articles] = await Promise.all([
    prisma.articleCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { articles: true } },
      },
    }),
    prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
  ]);

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  return (
    <AdminPage
      badge="Nội dung / Bài viết"
      description="Quản lý danh mục và bài viết tin tức. Bài đã đăng sẽ hiển thị tại /tin-tuc trên trang công khai."
      feedback={resolveFeedback(params?.feedback)}
      title="Quản lý Bài viết"
    >
      {/* ── Article Categories ─────────────────────────────────── */}
      <SectionCard
        description="Danh mục dùng để phân loại bài viết trên trang tin tức."
        title="Danh mục bài viết"
      >
        <form action={createArticleCategoryAction} className="grid gap-4">
          <FieldGrid>
            <Input label="Tên danh mục" name="name" required />
            <Input label="Slug (tự động nếu để trống)" name="slug" />
            <Input defaultValue="0" label="Thứ tự" name="sortOrder" type="number" />
          </FieldGrid>
          <FormActions primaryLabel="Tạo danh mục" />
        </form>

        {categories.length > 0 && (
          <div className="mt-4">
            <DataTable
              headers={["Danh mục", "Slug", "Số bài", "Thao tác"]}
              rows={categories.map((cat) => (
                <tr key={cat.id}>
                  <TableCell>
                    <div className="font-medium">{cat.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-[var(--bankng-text-secondary)]">{cat.slug}</div>
                  </TableCell>
                  <TableCell>{cat._count.articles} bài</TableCell>
                  <TableCell>
                    <form action={updateArticleCategoryAction} className="grid gap-2">
                      <input name="id" type="hidden" value={cat.id} />
                      <Input defaultValue={cat.name} label="Tên" name="name" required />
                      <Input defaultValue={cat.slug} label="Slug" name="slug" />
                      <Input
                        defaultValue={String(cat.sortOrder)}
                        label="Thứ tự"
                        name="sortOrder"
                        type="number"
                      />
                      <FormActions
                        primaryLabel="Lưu"
                        secondary={
                          cat._count.articles === 0 ? (
                            <button
                              className="rounded-md border border-[var(--bankng-border)] px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              formAction={deleteArticleCategoryAction}
                              type="submit"
                            >
                              Xóa
                            </button>
                          ) : (
                            <span className="text-xs text-[var(--bankng-text-secondary)]">
                              Còn {cat._count.articles} bài liên kết
                            </span>
                          )
                        }
                      />
                    </form>
                  </TableCell>
                </tr>
              ))}
            />
          </div>
        )}
      </SectionCard>

      {/* ── Create Article ─────────────────────────────────────── */}
      <SectionCard
        description="Soạn bài viết mới. Để đăng công khai, chọn trạng thái 'Đã đăng'."
        title="Tạo bài viết mới"
      >
        {categories.length === 0 ? (
          <p className="text-sm text-amber-600">
            ⚠️ Chưa có danh mục nào. Tạo danh mục trước khi viết bài.
          </p>
        ) : (
          <form action={createArticleAction} className="grid gap-4">
            <FieldGrid>
              <Input label="Tiêu đề bài viết" name="title" required />
              <Input label="Slug (tự động nếu để trống)" name="slug" />
              <SelectField label="Danh mục" name="categoryId" options={categoryOptions} />
              <Input label="Tác giả" name="authorName" />
              <Input label="Thời gian đọc (phút)" name="readTimeMin" type="number" />
              <Input label="Ảnh bìa (URL)" name="coverImage" type="url" />
              <SelectField defaultValue="draft" label="Trạng thái" name="status" options={STATUS_OPTIONS} />
            </FieldGrid>
            <TextAreaField label="Tóm tắt (excerpt)" name="excerpt" rows={2} />
            <TextAreaField label="Nội dung (Markdown/HTML)" name="content" rows={12} />
            <CheckboxField label="Bài nổi bật" name="isFeatured" />
            <FormActions primaryLabel="Tạo bài viết" />
          </form>
        )}
      </SectionCard>

      {/* ── Articles List ──────────────────────────────────────── */}
      <SectionCard title={`Danh sách bài viết (${articles.length})`}>
        {articles.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--bankng-text-secondary)]">
            Chưa có bài viết nào. Tạo bài viết đầu tiên ở trên.
          </p>
        ) : (
          <DataTable
            headers={["Bài viết", "Danh mục", "Trạng thái", "Ngày tạo", "Thao tác"]}
            rows={articles.map((article) => (
              <tr key={article.id}>
                <TableCell>
                  <div className="max-w-xs font-medium">{article.title}</div>
                  <div className="text-xs text-[var(--bankng-text-secondary)]">{article.slug}</div>
                  {article.isFeatured && (
                    <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                      ⭐ Nổi bật
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">{article.category.name}</div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(article.status)}`}
                  >
                    {statusLabel(article.status)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{article.createdAt.toISOString().slice(0, 10)}</div>
                </TableCell>
                <TableCell>
                  <form action={updateArticleAction} className="grid gap-2">
                    <input name="id" type="hidden" value={article.id} />
                    <Input defaultValue={article.title} label="Tiêu đề" name="title" required />
                    <Input defaultValue={article.slug} label="Slug" name="slug" />
                    <SelectField
                      defaultValue={article.categoryId}
                      label="Danh mục"
                      name="categoryId"
                      options={categoryOptions}
                    />
                    <Input
                      defaultValue={article.authorName ?? ""}
                      label="Tác giả"
                      name="authorName"
                    />
                    <Input
                      defaultValue={article.readTimeMin?.toString() ?? ""}
                      label="Phút đọc"
                      name="readTimeMin"
                      type="number"
                    />
                    <Input
                      defaultValue={article.coverImage ?? ""}
                      label="Ảnh bìa URL"
                      name="coverImage"
                    />
                    <SelectField
                      defaultValue={article.status}
                      label="Trạng thái"
                      name="status"
                      options={STATUS_OPTIONS}
                    />
                    <TextAreaField
                      defaultValue={article.excerpt}
                      label="Tóm tắt"
                      name="excerpt"
                      rows={2}
                    />
                    <TextAreaField
                      defaultValue={article.content}
                      label="Nội dung"
                      name="content"
                      rows={10}
                    />
                    <CheckboxField
                      defaultChecked={article.isFeatured}
                      label="Bài nổi bật"
                      name="isFeatured"
                    />
                    <FormActions
                      primaryLabel="Lưu bài"
                      secondary={
                        <div className="flex flex-wrap gap-2">
                          {article.status !== "active" && (
                            <button
                              className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
                              formAction={publishArticleAction}
                              type="submit"
                            >
                              Đăng bài
                            </button>
                          )}
                          {article.status === "active" && (
                            <button
                              className="rounded-md border border-[var(--bankng-border)] px-3 py-2 text-sm"
                              formAction={unpublishArticleAction}
                              type="submit"
                            >
                              Gỡ bài
                            </button>
                          )}
                          <button
                            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
                            formAction={deleteArticleAction}
                            type="submit"
                          >
                            Xóa
                          </button>
                        </div>
                      }
                    />
                  </form>
                </TableCell>
              </tr>
            ))}
          />
        )}
      </SectionCard>
    </AdminPage>
  );
}
