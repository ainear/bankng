import { describe, expect, it } from "vitest";
import { getFreshnessIndicator } from "./freshness";

describe("getFreshnessIndicator", () => {
  it("marks recent verified rates as fresh", () => {
    const result = getFreshnessIndicator({
      status: "verified",
      effectiveFrom: new Date("2026-04-20T00:00:00.000Z"),
      updatedAt: new Date("2026-04-21T00:00:00.000Z"),
      now: new Date("2026-04-21T12:00:00.000Z"),
      reliabilityScore: 80
    });

    expect(result.label).toBe("Fresh");
    expect(result.tone).toBe("success");
  });

  it("marks older but active rates as aging", () => {
    const result = getFreshnessIndicator({
      status: "verified",
      effectiveFrom: new Date("2026-03-20T00:00:00.000Z"),
      updatedAt: new Date("2026-03-20T00:00:00.000Z"),
      now: new Date("2026-04-21T12:00:00.000Z"),
      reliabilityScore: 70
    });

    expect(result.label).toBe("Aging");
    expect(result.tone).toBe("warning");
  });

  it("marks rejected or expired rates as stale", () => {
    const result = getFreshnessIndicator({
      status: "rejected",
      effectiveFrom: new Date("2026-04-20T00:00:00.000Z"),
      updatedAt: new Date("2026-04-21T00:00:00.000Z"),
      now: new Date("2026-04-21T12:00:00.000Z"),
      reliabilityScore: 50
    });

    expect(result.label).toBe("Blocked");
    expect(result.tone).toBe("danger");
  });
});
