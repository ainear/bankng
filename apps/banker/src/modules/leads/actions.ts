"use server";

import { prisma } from "@bankng/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function getBankerEmail() {
  return process.env.BANKER_EMAIL ?? "banker@bankng.local";
}

export async function updateBankerLeadStatusAction(formData: FormData) {
  const banker = await prisma.user.findUnique({
    where: { email: getBankerEmail() },
    select: { id: true }
  });

  if (!banker) {
    throw new Error("Banker not found");
  }

  const id = String(formData.get("id"));
  const nextStatus = String(formData.get("status"));
  const note = String(formData.get("note") ?? "").trim();

  const existingLead = await prisma.lead.findFirst({
    where: {
      id,
      assignedToId: banker.id
    },
    select: {
      id: true,
      status: true
    }
  });

  if (!existingLead) {
    throw new Error("Lead not assigned to banker");
  }

  await prisma.$transaction(async (tx) => {
    await tx.lead.update({
      where: { id },
      data: {
        status: nextStatus,
        message: note || undefined
      }
    });

    await tx.leadStatusHistory.create({
      data: {
        leadId: id,
        actorId: banker.id,
        fromStatus: existingLead.status,
        toStatus: nextStatus,
        note: note || null
      }
    });
  });

  revalidatePath("/leads");
  redirect("/leads?feedback=lead_updated");
}

export async function claimBankerLeadAction(formData: FormData) {
  const banker = await prisma.user.findUnique({
    where: { email: getBankerEmail() },
    select: { id: true }
  });

  if (!banker) {
    throw new Error("Banker not found");
  }

  const id = String(formData.get("id"));

  const existingLead = await prisma.lead.findFirst({
    where: {
      id,
      assignedToId: null
    },
    select: {
      id: true,
      status: true
    }
  });

  if (!existingLead) {
    throw new Error("Lead is already assigned or not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.lead.update({
      where: { id },
      data: {
        assignedToId: banker.id,
        status: "new"
      }
    });

    await tx.leadStatusHistory.create({
      data: {
        leadId: id,
        actorId: banker.id,
        fromStatus: existingLead.status,
        toStatus: "new",
        note: "Nhân viên tư vấn chủ động nhận lead từ sàn"
      }
    });
  });

  revalidatePath("/leads");
  redirect("/leads?feedback=lead_claimed");
}
