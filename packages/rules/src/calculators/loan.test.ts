import { describe, expect, it } from "vitest";
import { calculateEqualMonthlyPayment } from "./loan";

describe("calculateEqualMonthlyPayment", () => {
  it("calculates equal monthly payment for an amortized loan", () => {
    expect(
      Math.round(
        calculateEqualMonthlyPayment({
          principal: 1_000_000_000,
          annualRatePercent: 12,
          termMonths: 12
        }) / 1000,
      ) * 1000,
    ).toBe(88_849_000);
  });
});
