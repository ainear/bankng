import { describe, expect, it } from "vitest";
import { calculateSavingsMaturity } from "./savings";

describe("calculateSavingsMaturity", () => {
  it("calculates simple term deposit interest for a monthly term", () => {
    expect(
      calculateSavingsMaturity({
        principal: 100_000_000,
        annualRatePercent: 6,
        termMonths: 6
      }),
    ).toBe(103_000_000);
  });
});
