import { expect, test } from "@playwright/test";

test("banker homepage renders portal shell", async ({ page }) => {
  await page.goto("http://localhost:3002");

  await expect(page.getByRole("heading", { name: "Portal banker" })).toBeVisible();
  await expect(page.getByText("Lead inbox")).toBeVisible();
});
