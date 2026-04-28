import { z } from "zod";

export const bankFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2),
  shortName: z.string().max(50).optional(),
  websiteUrl: z.string().url().optional(),
  hotline: z.string().max(50).optional(),
  description: z.string().max(500).optional(),
  logoUrl: z.string().url().optional(),
  isActive: z.boolean()
});
