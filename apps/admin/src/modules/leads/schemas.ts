import { z } from "zod";

export const updateLeadSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "qualified", "closed"]),
  assignedToId: z.string().uuid().optional().or(z.literal("")),
  note: z.string().max(500).optional().or(z.literal(""))
});
