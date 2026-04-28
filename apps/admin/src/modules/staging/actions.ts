"use server";

import { prisma } from "@bankng/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { recordAuditLog } from "../shared/server/audit-log";
import { buildFeedbackPath } from "../shared/server/feedback";
import { parseOptionalStringField } from "../shared/server/form-values";
import { getAdminActor } from "../shared/server/admin-actor";
import { requireAdminSession } from "../auth/server/session";
import { reviewStagingRateSchema, bulkReviewStagingRateSchema } from "./schemas";

function revalidateStaging() {
  revalidatePath("/");
  revalidatePath("/staging");
}

export async function reviewStagingRateAction(formData: FormData) {
  await requireAdminSession();
  const actor = await getAdminActor();
  const parsed = reviewStagingRateSchema.parse({
    id: formData.get("id"),
    action: formData.get("action"),
    note: parseOptionalStringField(formData.get("note")) ?? ""
  });

  const existing = await prisma.crawlStagingRate.findUnique({
    where: { id: parsed.id },
    select: { id: true, status: true, crawlJobId: true }
  });

  if (!existing) {
    throw new Error("Staging rate not found");
  }

  const nextStatus = parsed.action === "approve" ? "verified" : "rejected";

  await prisma.$transaction(async (tx) => {
    await tx.crawlStagingRate.update({
      where: { id: parsed.id },
      data: {
        status: nextStatus,
        reviewedById: actor.id,
        reviewedAt: new Date(),
        publishedAt: parsed.action === "approve" ? new Date() : null
      }
    });
  });

  await recordAuditLog({
    entityType: "crawl_staging_rate",
    entityId: parsed.id,
    action: parsed.action,
    metadata: {
      status: nextStatus,
      crawlJobId: existing.crawlJobId,
      note: parsed.note
    }
  });

  revalidateStaging();
  redirect(buildFeedbackPath("/staging", `staging_${parsed.action === "reject" ? "rejected" : "approved"}`));
}

export async function bulkReviewStagingRateAction(formData: FormData) {
  await requireAdminSession();
  const actor = await getAdminActor();
  const ids = formData.getAll("ids") as string[];
  const parsed = bulkReviewStagingRateSchema.parse({
    ids,
    action: formData.get("action"),
    note: parseOptionalStringField(formData.get("note")) ?? ""
  });

  const nextStatus = parsed.action === "approve" ? "verified" : "rejected";

  await prisma.$transaction(async (tx) => {
    await tx.crawlStagingRate.updateMany({
      where: { id: { in: parsed.ids } },
      data: {
        status: nextStatus,
        reviewedById: actor.id,
        reviewedAt: new Date(),
        publishedAt: parsed.action === "approve" ? new Date() : null
      }
    });
  });

  await recordAuditLog({
    entityType: "crawl_staging_rate",
    entityId: `bulk:${parsed.ids.length}`,
    action: `bulk_${parsed.action}`,
    metadata: {
      count: parsed.ids.length,
      ids: parsed.ids,
      status: nextStatus,
      note: parsed.note
    }
  });

  revalidateStaging();
  redirect(buildFeedbackPath("/staging", `staging_bulk_${parsed.action === "reject" ? "rejected" : "approved"}`));
}

export async function publishStagingRateAction(formData: FormData) {
  await requireAdminSession();
  const actor = await getAdminActor();
  const id = String(formData.get("id"));

  const staging = await prisma.crawlStagingRate.findUnique({
    where: { id },
    include: { crawlJob: true }
  });

  if (!staging) { throw new Error("Staging rate not found"); }
  if (staging.status !== "pending") { throw new Error("Only pending rates can be published"); }

  await prisma.$transaction(async (tx) => {
    let bank = await tx.bank.findUnique({ where: { slug: staging.bankSlug } });
    if (!bank) {
      bank = await tx.bank.create({ data: { slug: staging.bankSlug, name: staging.bankName, isActive: true } });
    }

    const category = await tx.productCategory.findFirst({ where: { isActive: true } });
    if (!category) { throw new Error("No active product category found"); }

    let product = await tx.financialProduct.findFirst({ where: { bankId: bank.id, name: staging.productName } });
    if (!product) {
      product = await tx.financialProduct.create({
        data: {
          bankId: bank.id, categoryId: category.id, name: staging.productName,
          slug: `${staging.bankSlug}-${staging.productName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
          status: "active", isPublic: true
        }
      });
    }

    let variant = await tx.productVariant.findFirst({ where: { productId: product.id, variantName: staging.variantName } });
    if (!variant) {
      variant = await tx.productVariant.create({
        data: {
          productId: product.id, variantName: staging.variantName,
          slug: `${product.slug}-${staging.variantName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
          status: "active"
        }
      });
    }

    let rateSource = await tx.rateSource.findFirst({ where: { sourceName: "nganhang.com crawler" } });
    if (!rateSource) {
      rateSource = await tx.rateSource.create({
        data: { sourceType: "crawler", sourceName: "nganhang.com crawler", sourceUrl: staging.crawlJob.sourceUrl, reliabilityScore: 60 }
      });
    }

    const snapshot = await tx.interestRateSnapshot.create({
      data: {
        productVariantId: variant.id, rateType: staging.rateType, termValue: staging.termValue,
        termUnit: staging.termUnit, rateValue: staging.rateValue, rateUnit: staging.rateUnit,
        minAmount: staging.minAmount, maxAmount: staging.maxAmount,
        effectiveFrom: staging.effectiveFrom, effectiveTo: staging.effectiveTo,
        provinceCode: staging.provinceCode, sourceId: rateSource.id,
        status: "verified", createdById: actor.id
      }
    });

    await tx.crawlStagingRate.update({
      where: { id },
      data: { status: "verified", reviewedById: actor.id, reviewedAt: new Date(), publishedAt: new Date() }
    });

    await tx.rateVerification.create({
      data: { rateId: snapshot.id, verifierId: actor.id, verdict: "verified", note: "Published from crawl staging" }
    });
  });

  await recordAuditLog({ entityType: "crawl_staging_rate", entityId: id, action: "publish", metadata: { publishedRateId: id } });
  revalidateStaging();
  redirect(buildFeedbackPath("/staging", "staging_published"));
}

export async function bulkPublishStagingRateAction(formData: FormData) {
  await requireAdminSession();
  const actor = await getAdminActor();
  const ids = formData.getAll("ids") as string[];

  const stagingRates = await prisma.crawlStagingRate.findMany({
    where: { id: { in: ids }, status: "pending" }, include: { crawlJob: true }
  });
  if (stagingRates.length === 0) { throw new Error("No pending staging rates to publish"); }

  const publishedIds: string[] = [];

  for (const staging of stagingRates) {
    await prisma.$transaction(async (tx) => {
      let bank = await tx.bank.findUnique({ where: { slug: staging.bankSlug } });
      if (!bank) { bank = await tx.bank.create({ data: { slug: staging.bankSlug, name: staging.bankName, isActive: true } }); }

      const category = await tx.productCategory.findFirst({ where: { isActive: true } });
      if (!category) { throw new Error("No active product category"); }

      let product = await tx.financialProduct.findFirst({ where: { bankId: bank.id, name: staging.productName } });
      if (!product) {
        product = await tx.financialProduct.create({
          data: { bankId: bank.id, categoryId: category.id, name: staging.productName,
            slug: `${staging.bankSlug}-${staging.productName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
            status: "active", isPublic: true }
        });
      }

      let variant = await tx.productVariant.findFirst({ where: { productId: product.id, variantName: staging.variantName } });
      if (!variant) {
        variant = await tx.productVariant.create({
          data: { productId: product.id, variantName: staging.variantName,
            slug: `${product.slug}-${staging.variantName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
            status: "active" }
        });
      }

      let rateSource = await tx.rateSource.findFirst({ where: { sourceName: "nganhang.com crawler" } });
      if (!rateSource) {
        rateSource = await tx.rateSource.create({
          data: { sourceType: "crawler", sourceName: "nganhang.com crawler", sourceUrl: staging.crawlJob.sourceUrl, reliabilityScore: 60 }
        });
      }

      const snapshot = await tx.interestRateSnapshot.create({
        data: {
          productVariantId: variant.id, rateType: staging.rateType, termValue: staging.termValue,
          termUnit: staging.termUnit, rateValue: staging.rateValue, rateUnit: staging.rateUnit,
          minAmount: staging.minAmount, maxAmount: staging.maxAmount,
          effectiveFrom: staging.effectiveFrom, effectiveTo: staging.effectiveTo,
          provinceCode: staging.provinceCode, sourceId: rateSource.id,
          status: "verified", createdById: actor.id
        }
      });

      await tx.crawlStagingRate.update({
        where: { id: staging.id },
        data: { status: "verified", reviewedById: actor.id, reviewedAt: new Date(), publishedAt: new Date() }
      });

      await tx.rateVerification.create({
        data: { rateId: snapshot.id, verifierId: actor.id, verdict: "verified", note: "Bulk published from crawl staging" }
      });

      publishedIds.push(staging.id);
    });
  }

  await recordAuditLog({ entityType: "crawl_staging_rate", entityId: `bulk:${publishedIds.length}`, action: "bulk_publish", metadata: { count: publishedIds.length, ids: publishedIds } });
  revalidateStaging();
  redirect(buildFeedbackPath("/staging", "staging_bulk_published"));
}

export async function deleteStagingRateAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));

  await prisma.crawlStagingRate.delete({ where: { id } });
  await recordAuditLog({
    entityType: "crawl_staging_rate",
    entityId: id,
    action: "delete"
  });

  revalidateStaging();
  redirect(buildFeedbackPath("/staging", "staging_deleted"));
}

export async function cancelCrawlJobAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));

  await prisma.crawlJob.update({
    where: { id },
    data: {
      status: "cancelled",
      finishedAt: new Date()
    }
  });

  await recordAuditLog({
    entityType: "crawl_job",
    entityId: id,
    action: "cancel"
  });

  revalidateStaging();
  redirect(buildFeedbackPath("/staging", "crawl_cancelled"));
}

export async function retryCrawlJobAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));

  await prisma.crawlJob.update({
    where: { id },
    data: {
      status: "running",
      errorMsg: null,
      startedAt: new Date(),
      finishedAt: null
    }
  });

  await recordAuditLog({
    entityType: "crawl_job",
    entityId: id,
    action: "retry"
  });

  revalidateStaging();
  redirect(buildFeedbackPath("/staging", "crawl_retry_started"));
}