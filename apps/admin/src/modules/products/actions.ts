"use server";

import { prisma } from "@bankng/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { toSlug } from "@bankng/shared-utils";
import { recordAuditLog } from "../shared/server/audit-log";
import { requireAdminSession } from "../auth/server/session";
import { buildFeedbackPath } from "../shared/server/feedback";
import {
  parseBooleanField,
  parseOptionalIntegerField,
  parseOptionalNumberField,
  parseOptionalStringField
} from "../shared/server/form-values";
import { productFormSchema, variantFormSchema } from "./schemas";

function revalidateProducts() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/rates");
}

export async function createProductAction(formData: FormData) {
  await requireAdminSession();
  const rawName = String(formData.get("name"));
  const parsed = productFormSchema.parse({
    bankId: formData.get("bankId"),
    categoryId: formData.get("categoryId"),
    name: rawName,
    slug: toSlug(parseOptionalStringField(formData.get("slug")) ?? rawName),
    shortDescription: parseOptionalStringField(formData.get("shortDescription")),
    longDescription: parseOptionalStringField(formData.get("longDescription")),
    status: formData.get("status"),
    rankingScore: parseOptionalNumberField(formData.get("rankingScore")),
    featuredRank: parseOptionalIntegerField(formData.get("featuredRank")),
    isPublic: parseBooleanField(formData.get("isPublic"))
  });

  const product = await prisma.financialProduct.create({ data: parsed });
  await recordAuditLog({
    entityType: "financial_product",
    entityId: product.id,
    action: "create",
    metadata: { slug: product.slug }
  });

  revalidateProducts();
  redirect(buildFeedbackPath("/products", "product_created"));
}

export async function updateProductAction(formData: FormData) {
  await requireAdminSession();
  const rawName = String(formData.get("name"));
  const parsed = productFormSchema.parse({
    id: formData.get("id"),
    bankId: formData.get("bankId"),
    categoryId: formData.get("categoryId"),
    name: rawName,
    slug: toSlug(parseOptionalStringField(formData.get("slug")) ?? rawName),
    shortDescription: parseOptionalStringField(formData.get("shortDescription")),
    longDescription: parseOptionalStringField(formData.get("longDescription")),
    status: formData.get("status"),
    rankingScore: parseOptionalNumberField(formData.get("rankingScore")),
    featuredRank: parseOptionalIntegerField(formData.get("featuredRank")),
    isPublic: parseBooleanField(formData.get("isPublic"))
  });

  const product = await prisma.financialProduct.update({
    where: { id: parsed.id },
    data: parsed
  });
  await recordAuditLog({
    entityType: "financial_product",
    entityId: product.id,
    action: "update",
    metadata: { slug: product.slug }
  });

  revalidateProducts();
  redirect(buildFeedbackPath("/products", "product_updated"));
}

export async function deleteProductAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));
  await prisma.financialProduct.delete({ where: { id } });
  await recordAuditLog({
    entityType: "financial_product",
    entityId: id,
    action: "delete"
  });

  revalidateProducts();
  redirect(buildFeedbackPath("/products", "product_deleted"));
}

export async function createVariantAction(formData: FormData) {
  await requireAdminSession();
  const rawName = String(formData.get("variantName"));
  const parsed = variantFormSchema.parse({
    productId: formData.get("productId"),
    variantName: rawName,
    slug: toSlug(parseOptionalStringField(formData.get("slug")) ?? rawName),
    targetSegment: parseOptionalStringField(formData.get("targetSegment")),
    minAmount: parseOptionalNumberField(formData.get("minAmount")),
    maxAmount: parseOptionalNumberField(formData.get("maxAmount")),
    minTermMonth: parseOptionalIntegerField(formData.get("minTermMonth")),
    maxTermMonth: parseOptionalIntegerField(formData.get("maxTermMonth")),
    collateralRequired: formData.has("collateralRequired")
      ? parseBooleanField(formData.get("collateralRequired"))
      : undefined,
    incomeRequirement: parseOptionalStringField(formData.get("incomeRequirement")),
    note: parseOptionalStringField(formData.get("note")),
    status: formData.get("status")
  });

  const variant = await prisma.productVariant.create({ data: parsed });
  await recordAuditLog({
    entityType: "product_variant",
    entityId: variant.id,
    action: "create",
    metadata: { slug: variant.slug }
  });

  revalidateProducts();
  redirect(buildFeedbackPath("/products", "variant_created"));
}

export async function updateVariantAction(formData: FormData) {
  await requireAdminSession();
  const rawName = String(formData.get("variantName"));
  const parsed = variantFormSchema.parse({
    id: formData.get("id"),
    productId: formData.get("productId"),
    variantName: rawName,
    slug: toSlug(parseOptionalStringField(formData.get("slug")) ?? rawName),
    targetSegment: parseOptionalStringField(formData.get("targetSegment")),
    minAmount: parseOptionalNumberField(formData.get("minAmount")),
    maxAmount: parseOptionalNumberField(formData.get("maxAmount")),
    minTermMonth: parseOptionalIntegerField(formData.get("minTermMonth")),
    maxTermMonth: parseOptionalIntegerField(formData.get("maxTermMonth")),
    collateralRequired: formData.has("collateralRequired")
      ? parseBooleanField(formData.get("collateralRequired"))
      : undefined,
    incomeRequirement: parseOptionalStringField(formData.get("incomeRequirement")),
    note: parseOptionalStringField(formData.get("note")),
    status: formData.get("status")
  });

  const variant = await prisma.productVariant.update({
    where: { id: parsed.id },
    data: parsed
  });
  await recordAuditLog({
    entityType: "product_variant",
    entityId: variant.id,
    action: "update",
    metadata: { slug: variant.slug }
  });

  revalidateProducts();
  redirect(buildFeedbackPath("/products", "variant_updated"));
}

export async function deleteVariantAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));

  await prisma.productVariant.delete({ where: { id } });
  await recordAuditLog({
    entityType: "product_variant",
    entityId: id,
    action: "delete"
  });

  revalidateProducts();
  redirect(buildFeedbackPath("/products", "variant_deleted"));
}
