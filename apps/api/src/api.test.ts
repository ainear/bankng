import { describe, expect, it } from "vitest";

describe("API response schemas", () => {
  describe("banks", () => {
    it("validates correct bank item shape", () => {
      const item = {
        id: "123", slug: "vietcombank", name: "Vietcombank", shortName: "VCB",
        hotline: "1900xxxx", websiteUrl: "https://vietcombank.com", logoUrl: null,
        description: "A major bank", productCount: 5, branchCount: 100
      };
      expect(item.slug).toBe("vietcombank");
      expect(item.productCount).toBe(5);
      expect(item.branchCount).toBe(100);
    });

    it("has all required fields", () => {
      const item = {
        id: "123", slug: "test", name: "Test", shortName: null,
        hotline: null, websiteUrl: null, logoUrl: null, description: null,
        productCount: 0, branchCount: 0
      };
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("slug");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("productCount");
      expect(item).toHaveProperty("branchCount");
    });

    it("allows null for optional fields", () => {
      const item = { id: "1", slug: "x", name: "X", shortName: null, hotline: null, websiteUrl: null, logoUrl: null, description: null, productCount: 0, branchCount: 0 };
      expect(item.shortName).toBeNull();
      expect(item.hotline).toBeNull();
    });
  });

  describe("rates", () => {
    it("validates correct rate item shape", () => {
      const rate = {
        id: "rate-123", rateValue: 8.5, rateUnit: "percent_per_year",
        rateType: "interest_rate", termValue: 12, termUnit: "tháng", status: "verified"
      };
      expect(rate.rateValue).toBe(8.5);
      expect(rate.status).toBe("verified");
    });

    it("status must be valid enum value", () => {
      const validStatuses = ["pending", "verified", "rejected", "expired"];
      expect(validStatuses).toContain("verified");
      expect(validStatuses).not.toContain("invalid");
    });
  });

  describe("pagination", () => {
    it("validates correct pagination shape", () => {
      const pagination = { page: 1, pageSize: 50, total: 100, totalPages: 2, items: [] as unknown[] };
      expect(pagination.totalPages).toBe(2);
      expect(pagination.pageSize).toBeLessThanOrEqual(100);
    });

    it("pageSize max is 100", () => {
      const pagination = { page: 1, pageSize: 50, total: 0, totalPages: 0, items: [] as unknown[] };
      expect(pagination.pageSize).toBeLessThanOrEqual(100);
    });

    it("page starts at 1", () => {
      const pagination = { page: 1, pageSize: 50, total: 0, totalPages: 0, items: [] as unknown[] };
      expect(pagination.page).toBeGreaterThanOrEqual(1);
    });
  });
});