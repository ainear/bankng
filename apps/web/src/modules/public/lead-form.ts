import { z } from "zod";

export const leadFormSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().max(500).optional().or(z.literal("")),
  sourcePage: z.string().min(2),
  contextType: z.string().min(2),
  contextSlug: z.string().min(2)
});
