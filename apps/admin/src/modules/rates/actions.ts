"use server";

import { prisma } from "@bankng/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { recordAuditLog } from "../shared/server/audit-log";
import { buildFeedbackPath } from "../shared/server/feedback";
import {
  parseOptionalIntegerField,
  parseOptionalNumberField,
  parseOptionalStringField,
  parseRequiredDateField
} from "../shared/server/form-values";
import { getAdminActor } from "../shared/server/admin-actor";
import { requireAdminSession } from "../auth/server/session";
import { rateFormSchema, rateSourceFormSchema } from "./schemas";

function revalidateRates() {
  revalidatePath("/");
  revalidatePath("/rates");
}

export async function createRateSourceAction(formData: FormData) {
  await requireAdminSession();
  const parsed = rateSourceFormSchema.parse({
    sourceType: formData.get("sourceType"),
    sourceName: formData.get("sourceName"),
    sourceUrl: parseOptionalStringField(formData.get("sourceUrl")),
    reliabilityScore: parseOptionalIntegerField(formData.get("reliabilityScore")) ?? 50
  });

  const source = await prisma.rateSource.create({ data: parsed });
  await recordAuditLog({
    entityType: "rate_source",
    entityId: source.id,
    action: "create",
    metadata: { sourceType: source.sourceType }
  });

  revalidateRates();
  redirect(buildFeedbackPath("/rates", "rate_source_created"));
}

export async function updateRateSourceAction(formData: FormData) {
  await requireAdminSession();
  const parsed = rateSourceFormSchema.parse({
    id: formData.get("id"),
    sourceType: formData.get("sourceType"),
    sourceName: formData.get("sourceName"),
    sourceUrl: parseOptionalStringField(formData.get("sourceUrl")),
    reliabilityScore: parseOptionalIntegerField(formData.get("reliabilityScore")) ?? 50
  });

  const source = await prisma.rateSource.update({
    where: { id: parsed.id },
    data: parsed
  });

  await recordAuditLog({
    entityType: "rate_source",
    entityId: source.id,
    action: "update",
    metadata: { sourceType: source.sourceType }
  });

  revalidateRates();
  redirect(buildFeedbackPath("/rates", "rate_source_updated"));
}

export async function deleteRateSourceAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));

  await prisma.rateSource.delete({ where: { id } });
  await recordAuditLog({
    entityType: "rate_source",
    entityId: id,
    action: "delete"
  });

  revalidateRates();
  redirect(buildFeedbackPath("/rates", "rate_source_deleted"));
}

export async function createRateAction(formData: FormData) {
  await requireAdminSession();
  const actor = await getAdminActor();
  const parsed = rateFormSchema.parse({
    productVariantId: formData.get("productVariantId"),
    branchId: parseOptionalStringField(formData.get("branchId")),
    provinceCode: parseOptionalStringField(formData.get("provinceCode")),
    rateType: formData.get("rateType"),
    termValue: parseOptionalIntegerField(formData.get("termValue")),
    termUnit: parseOptionalStringField(formData.get("termUnit")),
    rateValue: Number(formData.get("rateValue")),
    rateUnit: formData.get("rateUnit"),
    minAmount: parseOptionalNumberField(formData.get("minAmount")),
    maxAmount: parseOptionalNumberField(formData.get("maxAmount")),
    effectiveFrom: parseRequiredDateField(formData.get("effectiveFrom")),
    effectiveTo: parseOptionalStringField(formData.get("effectiveTo"))
      ? parseRequiredDateField(formData.get("effectiveTo"))
      : undefined,
    sourceId: formData.get("sourceId"),
    status: formData.get("status")
  });

  const rate = await prisma.interestRateSnapshot.create({
    data: {
      ...parsed,
      createdById: actor.id
    }
  });

  await recordAuditLog({
    entityType: "interest_rate_snapshot",
    entityId: rate.id,
    action: "create",
    metadata: { rateType: rate.rateType, status: rate.status }
  });

  revalidateRates();
  redirect(buildFeedbackPath("/rates", "rate_created"));
}

export async function updateRateAction(formData: FormData) {
  await requireAdminSession();
  const actor = await getAdminActor();
  const parsed = rateFormSchema.parse({
    id: formData.get("id"),
    productVariantId: formData.get("productVariantId"),
    branchId: parseOptionalStringField(formData.get("branchId")),
    provinceCode: parseOptionalStringField(formData.get("provinceCode")),
    rateType: formData.get("rateType"),
    termValue: parseOptionalIntegerField(formData.get("termValue")),
    termUnit: parseOptionalStringField(formData.get("termUnit")),
    rateValue: Number(formData.get("rateValue")),
    rateUnit: formData.get("rateUnit"),
    minAmount: parseOptionalNumberField(formData.get("minAmount")),
    maxAmount: parseOptionalNumberField(formData.get("maxAmount")),
    effectiveFrom: parseRequiredDateField(formData.get("effectiveFrom")),
    effectiveTo: parseOptionalStringField(formData.get("effectiveTo"))
      ? parseRequiredDateField(formData.get("effectiveTo"))
      : undefined,
    sourceId: formData.get("sourceId"),
    status: formData.get("status")
  });

  const rate = await prisma.interestRateSnapshot.update({
    where: { id: parsed.id },
    data: {
      ...parsed,
      createdById: actor.id
    }
  });

  await recordAuditLog({
    entityType: "interest_rate_snapshot",
    entityId: rate.id,
    action: "update",
    metadata: { rateType: rate.rateType, status: rate.status }
  });

  revalidateRates();
  redirect(buildFeedbackPath("/rates", "rate_updated"));
}

export async function deleteRateAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));

  await prisma.interestRateSnapshot.delete({ where: { id } });
  await recordAuditLog({
    entityType: "interest_rate_snapshot",
    entityId: id,
    action: "delete"
  });

  revalidateRates();
  redirect(buildFeedbackPath("/rates", "rate_deleted"));
}

export async function verifyRateAction(formData: FormData) {
  await requireAdminSession();
  const actor = await getAdminActor();
  const id = String(formData.get("id"));
  const note = parseOptionalStringField(formData.get("verificationNote"));

  await prisma.$transaction(async (tx) => {
    await tx.interestRateSnapshot.update({
      where: { id },
      data: {
        status: "verified"
      }
    });

    await tx.rateVerification.create({
      data: {
        rateId: id,
        verifierId: actor.id,
        verdict: "verified",
        note
      }
    });
  });

  await recordAuditLog({
    entityType: "interest_rate_snapshot",
    entityId: id,
    action: "verify",
    metadata: { verdict: "verified", note }
  });

  revalidateRates();
  redirect(buildFeedbackPath("/rates", "rate_verified"));
}

export async function rejectRateAction(formData: FormData) {
  await requireAdminSession();
  const actor = await getAdminActor();
  const id = String(formData.get("id"));
  const note = parseOptionalStringField(formData.get("verificationNote"));

  await prisma.$transaction(async (tx) => {
    await tx.interestRateSnapshot.update({
      where: { id },
      data: {
        status: "rejected"
      }
    });

    await tx.rateVerification.create({
      data: {
        rateId: id,
        verifierId: actor.id,
        verdict: "rejected",
        note
      }
    });
  });

  await recordAuditLog({
    entityType: "interest_rate_snapshot",
    entityId: id,
    action: "reject",
    metadata: { verdict: "rejected", note }
  });

  revalidateRates();
  redirect(buildFeedbackPath("/rates", "rate_rejected"));
}

export async function expireRateAction(formData: FormData) {
  await requireAdminSession();
  const actor = await getAdminActor();
  const id = String(formData.get("id"));
  const note = parseOptionalStringField(formData.get("verificationNote"));

  await prisma.$transaction(async (tx) => {
    await tx.interestRateSnapshot.update({
      where: { id },
      data: {
        status: "expired"
      }
    });

    await tx.rateVerification.create({
      data: {
        rateId: id,
        verifierId: actor.id,
        verdict: "expired",
        note
      }
    });
  });

  await recordAuditLog({
    entityType: "interest_rate_snapshot",
    entityId: id,
    action: "expire",
    metadata: { verdict: "expired", note }
  });

  revalidateRates();
  redirect(buildFeedbackPath("/rates", "rate_expired"));
}
