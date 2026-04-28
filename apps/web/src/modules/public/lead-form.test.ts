import { describe, expect, it } from "vitest";
import { leadFormSchema } from "./lead-form";

describe("leadFormSchema", () => {
  it("accepts a minimal lead payload", () => {
    const parsed = leadFormSchema.parse({
      name: "Test Lead",
      phone: "0900000001",
      email: "",
      message: "",
      sourcePage: "/compare/gui-tiet-kiem",
      contextType: "category",
      contextSlug: "gui-tiet-kiem"
    });

    expect(parsed.name).toBe("Test Lead");
    expect(parsed.phone).toBe("0900000001");
  });
});
