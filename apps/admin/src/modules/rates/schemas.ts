import { z } from "zod";

export const rateSourceFormSchema = z.object({
  id: z.string().uuid().optional(),
  sourceType: z.string().min(2),
  sourceName: z.string().min(2),
  sourceUrl: z.string().url().optional(),
  reliabilityScore: z.number().int().min(0).max(100)
});

export const rateFormSchema = z.object({
  id: z.string().uuid().optional(),
  productVariantId: z.string().uuid(),
  branchId: z.string().uuid().optional(),
  provinceCode: z.string().max(50).optional(),
  rateType: z.string().min(2),
  termValue: z.number().int().optional(),
  termUnit: z.string().max(30).optional(),
  rateValue: z.number(),
  rateUnit: z.string().min(2),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  effectiveFrom: z.date(),
  effectiveTo: z.date().optional(),
  sourceId: z.string().uuid(),
  status: z.enum(["pending", "verified", "rejected", "expired"])
});
