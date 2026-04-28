import { describe, expect, it } from "vitest";
import {
  parseBooleanField,
  parseOptionalIntegerField,
  parseOptionalNumberField,
  parseOptionalStringField,
  parseRequiredDateField
} from "./form-values";

describe("admin form value helpers", () => {
  it("parses checkbox values predictably", () => {
    expect(parseBooleanField("on")).toBe(true);
    expect(parseBooleanField("true")).toBe(true);
    expect(parseBooleanField("false")).toBe(false);
    expect(parseBooleanField(null)).toBe(false);
  });

  it("normalizes optional strings and empty values", () => {
    expect(parseOptionalStringField("  Demo Bank  ")).toBe("Demo Bank");
    expect(parseOptionalStringField("   ")).toBeUndefined();
    expect(parseOptionalStringField(null)).toBeUndefined();
  });

  it("parses optional numbers and integers", () => {
    expect(parseOptionalNumberField("6.5")).toBe(6.5);
    expect(parseOptionalNumberField("")).toBeUndefined();
    expect(parseOptionalIntegerField("12")).toBe(12);
    expect(parseOptionalIntegerField(null)).toBeUndefined();
  });

  it("parses ISO date input as a Date", () => {
    const value = parseRequiredDateField("2026-04-21");

    expect(value.toISOString()).toBe("2026-04-21T00:00:00.000Z");
  });
});
