export type EntityStatus = "draft" | "active" | "archived";

export type VerificationStatus = "pending" | "verified" | "rejected";

export type PublicProductSummary = {
  id: string;
  slug: string;
  name: string;
  bankName: string;
  categorySlug: string;
};
