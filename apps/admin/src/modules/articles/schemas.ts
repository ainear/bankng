import { z } from "zod";

export const createArticleCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
});

export const updateArticleCategorySchema = createArticleCategorySchema.extend({
  id: z.string().uuid(),
});

export const createArticleSchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(10),
  categoryId: z.string().uuid(),
  authorName: z.string().optional(),
  readTimeMin: z.coerce.number().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
  isFeatured: z.boolean().default(false),
});

export const updateArticleSchema = createArticleSchema.extend({
  id: z.string().uuid(),
});
