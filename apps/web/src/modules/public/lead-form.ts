import { z } from "zod";

const contextTypeEnum = z.enum(["category", "bank", "product", "tool"]);

export const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long").regex(/^[\p{L}\s]+$/u, "Name must contain only letters"),
  phone: z.string().min(8, "Invalid phone number").max(15, "Phone number too long").regex(/^0\d{7,14}$/, "Invalid Vietnamese phone format"),
  email: z.string().email("Invalid email format").max(255).optional().or(z.literal("")),
  message: z.string().max(500, "Message too long").optional().or(z.literal("")),
  sourcePage: z.string().min(2, "Invalid source").max(500).refine((val) => val.startsWith("/"), "Must be a relative path"),
  contextType: contextTypeEnum,
  contextSlug: z.string().min(2, "Invalid slug").max(100).regex(/^[a-z0-9-]+$/, "Invalid slug format")
});
