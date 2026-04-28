import { describe, expect, it } from "vitest";
import { filterCompareProducts } from "./filter-products";

const products = [
  {
    bank: { slug: "demo-bank" },
    variants: [{ minTermMonth: 6, rates: [{ status: "verified" as const }] }]
  },
  {
    bank: { slug: "other-bank" },
    variants: [{ minTermMonth: 12, rates: [{ status: "pending" as const }] }]
  }
];

describe("filterCompareProducts", () => {
  it("filters by bank", () => {
    expect(filterCompareProducts({ products, bank: "demo-bank" })).toHaveLength(1);
  });

  it("filters by term", () => {
    expect(filterCompareProducts({ products, term: "12" })).toHaveLength(1);
  });

  it("filters by status", () => {
    expect(filterCompareProducts({ products, status: "verified" })).toHaveLength(1);
  });
});
