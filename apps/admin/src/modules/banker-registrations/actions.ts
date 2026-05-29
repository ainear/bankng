"use server";

import { prisma } from "@bankng/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { recordAuditLog } from "../shared/server/audit-log";
import { requireAdminSession } from "../auth/server/session";
import { buildFeedbackPath } from "../shared/server/feedback";

function revalidateRegistrations() {
  revalidatePath("/");
  revalidatePath("/banker-registrations");
}

export async function approveRegistrationAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));
  const email = String(formData.get("email"));
  const fullName = String(formData.get("fullName"));
  const bankId = String(formData.get("bankId"));
  const title = formData.get("title") ? String(formData.get("title")) : null;
  const provinceCode = formData.get("provinceCode") ? String(formData.get("provinceCode")) : null;

  // 1. Mark registration as approved
  await prisma.bankerRegistration.update({
    where: { id },
    data: { status: "approved", reviewedAt: new Date() },
  });

  // 2. Create or update user + banker profile
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmYzZTEabu/sMsyGRFDvmsl7wHVpqG", // Temp password: Admin@123456
        status: "active",
        emailVerifiedAt: new Date(),
        profile: {
          create: { fullName },
        },
      },
    });
  }

  // 3. Create Banker record
  const slug = `${fullName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").trim()}-${Date.now()}`;
  const existingBanker = await prisma.banker.findFirst({ where: { userId: user.id } });
  if (!existingBanker) {
    await prisma.banker.create({
      data: {
        userId: user.id,
        slug,
        bankId,
        title,
        provinceCode,
        isActive: true,
        isVerified: true,
      },
    });
  }

  await recordAuditLog({
    entityType: "banker_registration",
    entityId: id,
    action: "approve",
    metadata: { email, fullName },
  });

  revalidateRegistrations();
  redirect(buildFeedbackPath("/banker-registrations", "banker_approved"));
}

export async function rejectRegistrationAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));

  await prisma.bankerRegistration.update({
    where: { id },
    data: { status: "rejected", reviewedAt: new Date() },
  });

  await recordAuditLog({
    entityType: "banker_registration",
    entityId: id,
    action: "reject",
  });

  revalidateRegistrations();
  redirect(buildFeedbackPath("/banker-registrations", "banker_rejected"));
}
