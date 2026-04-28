import { z } from "zod";

export const branchFormSchema = z.object({
  id: z.string().uuid().optional(),
  bankId: z.string().uuid(),
  provinceCode: z.string().min(2),
  districtCode: z.string().max(50).optional(),
  branchName: z.string().min(2),
  address: z.string().max(300).optional(),
  phone: z.string().max(50).optional(),
  isActive: z.boolean()
});
