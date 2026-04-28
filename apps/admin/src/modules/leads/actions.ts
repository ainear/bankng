"use server";

import { prisma } from "@bankng/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "../auth/server/session";
import { recordAuditLog } from "../shared/server/audit-log";
import { buildFeedbackPath } from "../shared/server/feedback";
import { parseOptionalStringField } from "../shared/server/form-values";
import { getAdminActor } from "../shared/server/admin-actor";
import { updateLeadSchema } from "./schemas";
import { shouldAppendLeadHistory } from "./history";

function revalidateLeads() {
  revalidatePath("/");
  revalidatePath("/leads");
}

export async function updateLeadAction(formData: FormData) {
  await requireAdminSession();
  const actor = await getAdminActor();
  const parsed = updateLeadSchema.parse({
    id: formData.get("id"),
    status: formData.get("status"),
    assignedToId: parseOptionalStringField(formData.get("assignedToId")) ?? "",
    note: parseOptionalStringField(formData.get("note")) ?? ""
  });

  const existingLead = await prisma.lead.findUnique({
    where: { id: parsed.id },
    select: { id: true, status: true, assignedToId: true }
  });

  if (!existingLead) {
    throw new Error("Lead not found");
  }

  const nextAssignedToId = parsed.assignedToId || null;

  const lead = await prisma.$transaction(async (tx) => {
    const updatedLead = await tx.lead.update({
      where: { id: parsed.id },
      data: {
        status: parsed.status,
        assignedToId: nextAssignedToId,
        message: parsed.note || undefined
      }
    });

    if (
      shouldAppendLeadHistory({
        currentStatus: existingLead.status,
        nextStatus: parsed.status,
        currentAssignedToId: existingLead.assignedToId,
        nextAssignedToId
      })
    ) {
      await tx.leadStatusHistory.create({
        data: {
          leadId: updatedLead.id,
          actorId: actor.id,
          fromStatus: existingLead.status,
          toStatus: parsed.status,
          note: parsed.note || null
        }
      });
    }

    return updatedLead;
  });

  await recordAuditLog({
    entityType: "lead",
    entityId: lead.id,
    action: "update",
    metadata: {
      status: lead.status,
      assignedToId: lead.assignedToId
    }
  });

  revalidateLeads();
  redirect(buildFeedbackPath("/leads", "lead_updated"));
}
