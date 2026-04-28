import { z } from "zod";

export const reviewStagingRateSchema = z.object({
  id: z.string().uuid(),
  action: z.enum(["approve", "reject"]),
  note: z.string().max(500).optional()
});

export const bulkReviewStagingRateSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
  action: z.enum(["approve", "reject"]),
  note: z.string().max(500).optional()
});