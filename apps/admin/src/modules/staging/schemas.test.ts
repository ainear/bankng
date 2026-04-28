import { describe, expect, it } from "vitest";
import { reviewStagingRateSchema, bulkReviewStagingRateSchema } from "./schemas";

describe("reviewStagingRateSchema", () => {
  it("parses valid approve action", () => {
    const result = reviewStagingRateSchema.parse({
      id: "550e8400-e29b-41d4-a716-446655440000",
      action: "approve",
      note: "looks good"
    });
    expect(result.action).toBe("approve");
  });

  it("parses valid reject action", () => {
    const result = reviewStagingRateSchema.parse({
      id: "550e8400-e29b-41d4-a716-446655440000",
      action: "reject",
      note: ""
    });
    expect(result.action).toBe("reject");
  });

  it("rejects invalid action", () => {
    expect(() =>
      reviewStagingRateSchema.parse({
        id: "550e8400-e29b-41d4-a716-446655440000",
        action: "maybe"
      })
    ).toThrow();
  });

  it("rejects invalid UUID", () => {
    expect(() =>
      reviewStagingRateSchema.parse({
        id: "not-a-uuid",
        action: "approve"
      })
    ).toThrow();
  });
});

describe("bulkReviewStagingRateSchema", () => {
  it("parses valid bulk approve", () => {
    const result = bulkReviewStagingRateSchema.parse({
      ids: [
        "550e8400-e29b-41d4-a716-446655440000",
        "550e8400-e29b-41d4-a716-446655440001"
      ],
      action: "approve",
      note: "bulk approve"
    });
    expect(result.ids).toHaveLength(2);
    expect(result.action).toBe("approve");
  });

  it("rejects empty ids array", () => {
    expect(() =>
      bulkReviewStagingRateSchema.parse({
        ids: [],
        action: "approve"
      })
    ).toThrow();
  });

  it("rejects non-UUID in ids", () => {
    expect(() =>
      bulkReviewStagingRateSchema.parse({
        ids: ["550e8400-e29b-41d4-a716-446655440000", "bad-uuid"],
        action: "reject"
      })
    ).toThrow();
  });
});