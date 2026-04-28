import { describe, expect, it } from "vitest";
import { getPublicFreshness } from "./freshness";

describe("getPublicFreshness", () => {
  it("marks recent verified data as fresh", () => {
    const result = getPublicFreshness({
      status: "verified",
      effectiveFrom: new Date("2026-04-20T00:00:00.000Z"),
      updatedAt: new Date("2026-04-20T00:00:00.000Z"),
      now: new Date("2026-04-21T00:00:00.000Z"),
      reliabilityScore: 80
    });

    expect(result.label).toBe("Moi cap nhat");
  });

  it("marks pending data as warning", () => {
    const result = getPublicFreshness({
      status: "pending",
      effectiveFrom: new Date("2026-04-20T00:00:00.000Z"),
      updatedAt: new Date("2026-04-20T00:00:00.000Z"),
      now: new Date("2026-04-21T00:00:00.000Z"),
      reliabilityScore: 80
    });

    expect(result.tone).toBe("warning");
  });
});
