"use server";

import { prisma } from "@bankng/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { recordAuditLog } from "../shared/server/audit-log";
import { requireAdminSession } from "../auth/server/session";
import { buildFeedbackPath } from "../shared/server/feedback";
import { parseBooleanField, parseOptionalStringField } from "../shared/server/form-values";
import { branchFormSchema } from "./schemas";

function revalidateBranches() {
  revalidatePath("/");
  revalidatePath("/banks");
  revalidatePath("/branches");
  revalidatePath("/rates");
}

export async function createBranchAction(formData: FormData) {
  await requireAdminSession();
  const parsed = branchFormSchema.parse({
    bankId: formData.get("bankId"),
    provinceCode: formData.get("provinceCode"),
    districtCode: parseOptionalStringField(formData.get("districtCode")),
    branchName: formData.get("branchName"),
    address: parseOptionalStringField(formData.get("address")),
    phone: parseOptionalStringField(formData.get("phone")),
    isActive: parseBooleanField(formData.get("isActive"))
  });

  const branch = await prisma.bankBranch.create({ data: parsed });
  await recordAuditLog({
    entityType: "bank_branch",
    entityId: branch.id,
    action: "create",
    metadata: { bankId: branch.bankId, provinceCode: branch.provinceCode }
  });

  revalidateBranches();
  redirect(buildFeedbackPath("/branches", "branch_created"));
}

export async function updateBranchAction(formData: FormData) {
  await requireAdminSession();
  const parsed = branchFormSchema.parse({
    id: formData.get("id"),
    bankId: formData.get("bankId"),
    provinceCode: formData.get("provinceCode"),
    districtCode: parseOptionalStringField(formData.get("districtCode")),
    branchName: formData.get("branchName"),
    address: parseOptionalStringField(formData.get("address")),
    phone: parseOptionalStringField(formData.get("phone")),
    isActive: parseBooleanField(formData.get("isActive"))
  });

  const branch = await prisma.bankBranch.update({
    where: { id: parsed.id },
    data: parsed
  });
  await recordAuditLog({
    entityType: "bank_branch",
    entityId: branch.id,
    action: "update",
    metadata: { bankId: branch.bankId, provinceCode: branch.provinceCode }
  });

  revalidateBranches();
  redirect(buildFeedbackPath("/branches", "branch_updated"));
}

export async function deleteBranchAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));

  await prisma.bankBranch.delete({ where: { id } });
  await recordAuditLog({
    entityType: "bank_branch",
    entityId: id,
    action: "delete"
  });

  revalidateBranches();
  redirect(buildFeedbackPath("/branches", "branch_deleted"));
}
