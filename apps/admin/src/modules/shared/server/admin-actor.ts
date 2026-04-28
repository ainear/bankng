import { prisma } from "@bankng/db";
import { requireAdminSession } from "@/modules/auth/server/session";

export async function getAdminActor() {
  const session = await requireAdminSession();
  const admin = await prisma.user.findUnique({
    where: { email: session.email },
    select: {
      id: true,
      email: true
    }
  });

  if (!admin) {
    throw new Error("Authenticated admin user not found");
  }

  return admin;
}
