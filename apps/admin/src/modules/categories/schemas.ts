import { z } from "zod";

export const categoryFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().max(500).optional(),
  compareEnabled: z.boolean(),
  isActive: z.boolean()
});
