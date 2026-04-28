"use server";

import { prisma } from "@bankng/db";
import { redirect } from "next/navigation";
import { isDuplicateLead } from "../lead-dedupe";
import { leadFormSchema } from "../lead-form";
import { normalizePhone } from "../normalize-phone";

function buildLeadFeedbackPath(sourcePage: string) {
  const safePath = sourcePage.startsWith("/") ? sourcePage : "/";
  const separator = safePath.includes("?") ? "&" : "?";
  return `${safePath}${separator}feedback=lead_created`;
}

function buildDuplicateFeedbackPath(sourcePage: string) {
  const safePath = sourcePage.startsWith("/") ? sourcePage : "/";
  const separator = safePath.includes("?") ? "&" : "?";
  return `${safePath}${separator}feedback=lead_duplicate`;
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
  const safePhone = normalizedPhone.replace(/[^a-zA-Z0-9]/g, "");
  const safeContextType = parsed.contextType.replace(/[^a-zA-Z0-9-]/g, "");
  const safeContextSlug = parsed.contextSlug.replace(/[^a-zA-Z0-9-]/g, "");
  const lockKey = `${safePhone}:${safeContextType}:${safeContextSlug}`;

  let outcome: { duplicated: boolean };
  try {
    outcome = await prisma.$transaction(async (tx) => {
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
          existingPhone: existingLead.phoneNormalized
            ?? (existingLead.phone ? normalizePhone(existingLead.phone) : ""),
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
  } catch {
    const safePath = parsed.sourcePage.startsWith("/") ? parsed.sourcePage : "/";
    redirect(`${safePath}${safePath.includes("?") ? "&" : "?"}feedback=lead_error`);
  }

  if (outcome.duplicated) {
    redirect(buildDuplicateFeedbackPath(parsed.sourcePage));
  }

  redirect(buildLeadFeedbackPath(parsed.sourcePage));
}
