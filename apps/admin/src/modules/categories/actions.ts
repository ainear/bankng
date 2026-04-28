"use server";

import { prisma } from "@bankng/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { toSlug } from "@bankng/shared-utils";
import { recordAuditLog } from "../shared/server/audit-log";
import { requireAdminSession } from "../auth/server/session";
import { buildFeedbackPath } from "../shared/server/feedback";
import { parseBooleanField, parseOptionalStringField } from "../shared/server/form-values";
import { categoryFormSchema } from "./schemas";

function revalidateCategories() {
  revalidatePath("/");
  revalidatePath("/categories");
}

export async function createCategoryAction(formData: FormData) {
  await requireAdminSession();
  const rawName = String(formData.get("name"));
  const parsed = categoryFormSchema.parse({
    name: rawName,
    slug: toSlug(parseOptionalStringField(formData.get("slug")) ?? rawName),
    description: parseOptionalStringField(formData.get("description")),
    compareEnabled: parseBooleanField(formData.get("compareEnabled")),
    isActive: parseBooleanField(formData.get("isActive"))
  });

  const category = await prisma.productCategory.create({ data: parsed });
  await recordAuditLog({
    entityType: "product_category",
    entityId: category.id,
    action: "create",
    metadata: { slug: category.slug }
  });

  revalidateCategories();
  redirect(buildFeedbackPath("/categories", "category_created"));
}

export async function updateCategoryAction(formData: FormData) {
  await requireAdminSession();
  const rawName = String(formData.get("name"));
  const parsed = categoryFormSchema.parse({
    id: formData.get("id"),
    name: rawName,
    slug: toSlug(parseOptionalStringField(formData.get("slug")) ?? rawName),
    description: parseOptionalStringField(formData.get("description")),
    compareEnabled: parseBooleanField(formData.get("compareEnabled")),
    isActive: parseBooleanField(formData.get("isActive"))
  });

  const category = await prisma.productCategory.update({
    where: { id: parsed.id },
    data: parsed
  });
  await recordAuditLog({
    entityType: "product_category",
    entityId: category.id,
    action: "update",
    metadata: { slug: category.slug }
  });

  revalidateCategories();
  redirect(buildFeedbackPath("/categories", "category_updated"));
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));

  await prisma.productCategory.delete({ where: { id } });
  await recordAuditLog({
    entityType: "product_category",
    entityId: id,
    action: "delete"
  });

  revalidateCategories();
  redirect(buildFeedbackPath("/categories", "category_deleted"));
}
