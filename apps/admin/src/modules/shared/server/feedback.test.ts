import { describe, expect, it } from "vitest";
import { buildFeedbackPath, resolveFeedback } from "./feedback";

describe("admin feedback helpers", () => {
  it("builds a feedback redirect path", () => {
    expect(buildFeedbackPath("/banks", "bank_created")).toBe("/banks?feedback=bank_created");
  });

  it("resolves known feedback codes", () => {
    expect(resolveFeedback("branch_deleted")).toEqual({
      tone: "success",
      title: "Da xoa branch",
      description: "Branch da duoc go khoi catalog va audit log da duoc ghi."
    });
  });

  it("returns null for unknown feedback codes", () => {
    expect(resolveFeedback("unknown_code")).toBeNull();
  });
});
