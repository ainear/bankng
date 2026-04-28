import { describe, expect, it } from "vitest";
import { isDuplicateLead } from "./lead-dedupe";

describe("isDuplicateLead", () => {
  it("detects duplicate when phone and context match within lookback window", () => {
    const result = isDuplicateLead({
      submittedPhone: "0900000001",
      existingPhone: "0900000001",
      submittedContextSlug: "gui-tiet-kiem",
      existingContextSlug: "gui-tiet-kiem",
      submittedContextType: "category",
      existingContextType: "category",
      submittedAt: new Date("2026-04-22T00:00:00.000Z"),
      existingCreatedAt: new Date("2026-04-21T12:00:00.000Z"),
      lookbackHours: 24
    });

    expect(result).toBe(true);
  });

  it("allows lead when context differs", () => {
    const result = isDuplicateLead({
      submittedPhone: "0900000001",
      existingPhone: "0900000001",
      submittedContextSlug: "bank-a",
      existingContextSlug: "bank-b",
      submittedContextType: "bank",
      existingContextType: "bank",
      submittedAt: new Date("2026-04-22T00:00:00.000Z"),
      existingCreatedAt: new Date("2026-04-21T12:00:00.000Z"),
      lookbackHours: 24
    });

    expect(result).toBe(false);
  });

  it("allows same phone if context type differs", () => {
    const result = isDuplicateLead({
      submittedPhone: "0900000001",
      existingPhone: "0900000001",
      submittedContextSlug: "same-slug",
      existingContextSlug: "same-slug",
      submittedContextType: "bank",
      existingContextType: "product",
      submittedAt: new Date("2026-04-22T00:00:00.000Z"),
      existingCreatedAt: new Date("2026-04-21T12:00:00.000Z"),
      lookbackHours: 24
    });

    expect(result).toBe(false);
  });
});
