import { prisma } from "@bankng/db";
import type { Prisma } from "@bankng/db";
import { getAdminActor } from "./admin-actor";

type AuditInput = {
  entityType: string;
  entityId: string;
  action: string;
  metadata?: Prisma.InputJsonValue;
};

export async function recordAuditLog(input: AuditInput) {
  const actor = await getAdminActor();

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      metadata: input.metadata
    }
  });
}
