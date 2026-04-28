import { describe, expect, it } from "vitest";
import { shouldAppendLeadHistory } from "./history";

describe("shouldAppendLeadHistory", () => {
  it("returns true when status changes", () => {
    expect(
      shouldAppendLeadHistory({
        currentStatus: "new",
        nextStatus: "contacted",
        currentAssignedToId: null,
        nextAssignedToId: null
      }),
    ).toBe(true);
  });

  it("returns true when assignment changes", () => {
    expect(
      shouldAppendLeadHistory({
        currentStatus: "new",
        nextStatus: "new",
        currentAssignedToId: null,
        nextAssignedToId: "abc"
      }),
    ).toBe(true);
  });

  it("returns false when nothing changes", () => {
    expect(
      shouldAppendLeadHistory({
        currentStatus: "new",
        nextStatus: "new",
        currentAssignedToId: null,
        nextAssignedToId: null
      }),
    ).toBe(false);
  });
});
