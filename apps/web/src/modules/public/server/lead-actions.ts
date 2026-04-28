"use server";

import { prisma } from "@bankng/db";
import { redirect } from "next/navigation";
import { isDuplicateLead } from "../lead-dedupe";
import { leadFormSchema } from "../lead-form";
import { normalizePhone } from "../normalize-phone";

function buildLeadFeedbackPath(sourcePage: string) {
  const separator = sourcePage.includes("?") ? "&" : "?";
  return `${sourcePage}${separator}feedback=lead_created`;
}

function buildDuplicateFeedbackPath(sourcePage: string) {
  const separator = sourcePage.includes("?") ? "&" : "?";
  return `${sourcePage}${separator}feedback=lead_duplicate`;
}

export async function submitLeadAction(formData: FormData) {
  const parsed = leadFormSchema.parse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
    sourcePage: formData.get("sourcePage"),
    contextType: formData.get("contextType"),
    contextSlug: formData.get("contextSlug")
  });
  const normalizedPhone = normalizePhone(parsed.phone);
  const submittedAt = new Date();
  const lockKey = `${normalizedPhone}:${parsed.contextType}:${parsed.contextSlug}`;

  const outcome = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))`;

    const existingLead = await tx.lead.findFirst({
      where: {
        phoneNormalized: normalizedPhone,
        contextType: parsed.contextType,
        contextSlug: parsed.contextSlug
      },
      orderBy: { createdAt: "desc" }
    });

    if (
      existingLead &&
      isDuplicateLead({
        submittedPhone: normalizedPhone,
        existingPhone: existingLead.phoneNormalized ?? normalizePhone(existingLead.phone),
        submittedContextSlug: parsed.contextSlug,
        existingContextSlug: existingLead.contextSlug,
        submittedContextType: parsed.contextType,
        existingContextType: existingLead.contextType,
        submittedAt,
        existingCreatedAt: existingLead.createdAt,
        lookbackHours: 24
      })
    ) {
      return { duplicated: true as const };
    }

    await tx.lead.create({
      data: {
        name: parsed.name,
        phone: parsed.phone,
        phoneNormalized: normalizedPhone,
        email: parsed.email || null,
        message: parsed.message || null,
        sourcePage: parsed.sourcePage,
        contextType: parsed.contextType,
        contextSlug: parsed.contextSlug
      }
    });

    return { duplicated: false as const };
  });

  if (outcome.duplicated) {
    redirect(buildDuplicateFeedbackPath(parsed.sourcePage));
  }

  redirect(buildLeadFeedbackPath(parsed.sourcePage));
}
