import { describe, expect, it } from "vitest";
import { stagingRateSchema, crawlConfig } from "./types";

describe("stagingRateSchema", () => {
  it("parses valid rate data", () => {
    const result = stagingRateSchema.parse({
      bankSlug: "vietcombank",
      bankName: "Vietcombank",
      productName: "Vay mua nha",
      variantName: "12 thang",
      rateType: "interest_rate",
      termValue: 12,
      termUnit: "tháng",
      rateValue: 8.5,
      rateUnit: "percent_per_year",
      effectiveFrom: new Date(),
      effectiveTo: null,
      provinceCode: null,
      minAmount: null,
      maxAmount: null
    });
    expect(result.bankSlug).toBe("vietcombank");
    expect(result.rateValue).toBe(8.5);
  });

  it("rejects non-numeric rate value", () => {
    expect(() =>
      stagingRateSchema.parse({
        bankSlug: "vietcombank",
        bankName: "Vietcombank",
        productName: "Vay mua nha",
        variantName: "12 thang",
        rateType: "interest_rate",
        termValue: 12,
        termUnit: "tháng",
        rateValue: "not a number" as unknown as number,
        effectiveFrom: new Date(),
        effectiveTo: null,
        provinceCode: null,
        minAmount: null,
        maxAmount: null
      })
    ).toThrow();
  });

  it("applies default rateUnit", () => {
    const result = stagingRateSchema.parse({
      bankSlug: "vietcombank",
      bankName: "Vietcombank",
      productName: "Vay mua nha",
      variantName: "Standard",
      rateType: "interest_rate",
      termValue: null,
      termUnit: null,
      rateValue: 7.5,
      effectiveFrom: new Date(),
      effectiveTo: null,
      provinceCode: null,
      minAmount: null,
      maxAmount: null
    });
    expect(result.rateUnit).toBe("percent_per_year");
  });
});

describe("crawlConfig", () => {
  it("has 5 pages configured", () => {
    expect(crawlConfig.pages).toHaveLength(5);
  });

  it("has correct base URL", () => {
    expect(crawlConfig.baseUrl).toBe("https://nganhang.com");
  });

  it("has valid delay and timeout", () => {
    expect(crawlConfig.delayMs).toBeGreaterThan(0);
    expect(crawlConfig.timeoutMs).toBeGreaterThan(0);
  });
});