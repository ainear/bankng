import { z } from "zod";

export const productFormSchema = z.object({
  id: z.string().uuid().optional(),
  bankId: z.string().uuid(),
  categoryId: z.string().uuid(),
  name: z.string().min(2),
  slug: z.string().min(2),
  shortDescription: z.string().max(200).optional(),
  longDescription: z.string().max(1000).optional(),
  status: z.enum(["draft", "active", "archived"]),
  rankingScore: z.number().optional(),
  featuredRank: z.number().int().optional(),
  isPublic: z.boolean()
});

export const variantFormSchema = z.object({
  id: z.string().uuid().optional(),
  productId: z.string().uuid(),
  variantName: z.string().min(2),
  slug: z.string().min(2),
  targetSegment: z.string().max(120).optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  minTermMonth: z.number().int().optional(),
  maxTermMonth: z.number().int().optional(),
  collateralRequired: z.boolean().optional(),
  incomeRequirement: z.string().max(300).optional(),
  note: z.string().max(500).optional(),
  status: z.enum(["draft", "active", "archived"])
});
