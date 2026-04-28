import { z } from "zod";

export const stagingRateSchema = z.object({
  bankSlug: z.string(),
  bankName: z.string(),
  productName: z.string(),
  variantName: z.string(),
  rateType: z.string(),
  termValue: z.number().int().nullable(),
  termUnit: z.string().nullable(),
  rateValue: z.number(),
  rateUnit: z.string().default("percent_per_year"),
  minAmount: z.number().nullable(),
  maxAmount: z.number().nullable(),
  effectiveFrom: z.date(),
  effectiveTo: z.date().nullable(),
  provinceCode: z.string().nullable(),
  rawData: z.record(z.unknown()).optional()
});

export type StagingRateInput = z.infer<typeof stagingRateSchema>;

export interface CrawlPageResult {
  url: string;
  rates: StagingRateInput[];
  banks: Array<{ slug: string; name: string }>;
  errors: string[];
}

export interface CrawlJobResult {
  jobId: string;
  pagesCrawled: number;
  totalRates: number;
  totalBanks: number;
  errors: string[];
  durationMs: number;
}

export const crawlConfig = {
  baseUrl: "https://nganhang.com",
  pages: [
    { path: "/", label: "homepage" },
    { path: "/gui-tiet-kiem", label: "savings" },
    { path: "/vay-mua-nha", label: "mortgage" },
    { path: "/vay-mua-xe", label: "auto-loan" },
    { path: "/vay-tin-chap", label: "personal-loan" }
  ],
  userAgent: "Bankng Bot/1.0 (+https://bankng.com/bot)",
  delayMs: 2000,
  timeoutMs: 30000
} as const;