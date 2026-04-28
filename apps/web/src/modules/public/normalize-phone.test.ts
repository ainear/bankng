import { describe, expect, it } from "vitest";
import { normalizePhone } from "./normalize-phone";

describe("normalizePhone", () => {
  it("strips separators", () => {
    expect(normalizePhone("090-000-0001")).toBe("0900000001");
  });

  it("normalizes +84 numbers to 0-prefixed local form", () => {
    expect(normalizePhone("+84 900 000 001")).toBe("0900000001");
  });
});
