"use server";

import { prisma } from "@bankng/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { toSlug } from "@bankng/shared-utils";
import { recordAuditLog } from "../shared/server/audit-log";
import { requireAdminSession } from "../auth/server/session";
import { buildFeedbackPath } from "../shared/server/feedback";
import { parseBooleanField, parseOptionalStringField } from "../shared/server/form-values";
import { bankFormSchema } from "./schemas";

function revalidateBanks() {
  revalidatePath("/");
  revalidatePath("/banks");
}

export async function createBankAction(formData: FormData) {
  await requireAdminSession();
  const parsed = bankFormSchema.parse({
    name: formData.get("name"),
    shortName: parseOptionalStringField(formData.get("shortName")),
    websiteUrl: parseOptionalStringField(formData.get("websiteUrl")),
    hotline: parseOptionalStringField(formData.get("hotline")),
    description: parseOptionalStringField(formData.get("description")),
    logoUrl: parseOptionalStringField(formData.get("logoUrl")),
    isActive: parseBooleanField(formData.get("isActive"))
  });

  const bank = await prisma.bank.create({
    data: {
      ...parsed,
      slug: toSlug(parsed.shortName ?? parsed.name)
    }
  });

  await recordAuditLog({
    entityType: "bank",
    entityId: bank.id,
    action: "create",
    metadata: { name: bank.name }
  });

  revalidateBanks();
  redirect(buildFeedbackPath("/banks", "bank_created"));
}

export async function updateBankAction(formData: FormData) {
  await requireAdminSession();
  const parsed = bankFormSchema.parse({
    id: formData.get("id"),
    name: formData.get("name"),
    shortName: parseOptionalStringField(formData.get("shortName")),
    websiteUrl: parseOptionalStringField(formData.get("websiteUrl")),
    hotline: parseOptionalStringField(formData.get("hotline")),
    description: parseOptionalStringField(formData.get("description")),
    logoUrl: parseOptionalStringField(formData.get("logoUrl")),
    isActive: parseBooleanField(formData.get("isActive"))
  });

  const bank = await prisma.bank.update({
    where: { id: parsed.id },
    data: {
      ...parsed,
      slug: toSlug(parsed.shortName ?? parsed.name)
    }
  });

  await recordAuditLog({
    entityType: "bank",
    entityId: bank.id,
    action: "update",
    metadata: { name: bank.name }
  });

  revalidateBanks();
  redirect(buildFeedbackPath("/banks", "bank_updated"));
}

export async function deleteBankAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));

  await prisma.bank.delete({ where: { id } });
  await recordAuditLog({
    entityType: "bank",
    entityId: id,
    action: "delete"
  });

  revalidateBanks();
  redirect(buildFeedbackPath("/banks", "bank_deleted"));
}
