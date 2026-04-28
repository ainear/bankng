import { expect, test } from "@playwright/test";

const adminEmail = process.env.ADMIN_EMAIL ?? "admin@bankng.local";
const adminPassword = process.env.ADMIN_PASSWORD ?? "";

async function loginAdmin(page: Page) {
  await page.goto("http://localhost:3001");
  await expect(page).toHaveURL(/\/login/);
  await page.getByLabel("Admin email").fill(adminEmail);
  await page.getByLabel("Admin password").fill(adminPassword);
  await page.getByRole("button", { name: "Dang nhap admin" }).click();
  await expect(page).toHaveURL("http://localhost:3001/");
}

test("admin staging page loads with stats", async ({ page }) => {
  await loginAdmin(page);
  await page.goto("http://localhost:3001/staging");
  await expect(page.getByRole("heading", { name: "Crawl Staging Review" })).toBeVisible();
  await expect(page.getByText("Pending review")).toBeVisible();
  await expect(page.getByText("Approved")).toBeVisible();
  await expect(page.getByText("Rejected")).toBeVisible();
  await expect(page.getByText("Crawl Jobs")).toBeVisible();
  await expect(page.getByText("Staged Rates")).toBeVisible();
});

test("staging page filters work", async ({ page }) => {
  await loginAdmin(page);
  await page.goto("http://localhost:3001/staging");
  const statusFilter = page.locator("select[name='status']");
  await statusFilter.selectOption("pending");
  await page.getByRole("button", { name: "Filter" }).click();
  await expect(page).toHaveURL(/status=pending/);
});

test("staging page has bulk actions", async ({ page }) => {
  await loginAdmin(page);
  await page.goto("http://localhost:3001/staging");
  await expect(page.getByText("Bulk actions:")).toBeVisible();
  await expect(page.getByRole("button", { name: "Publish chọn" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Từ chối chọn" })).toBeVisible();
});

test("staging page pagination works", async ({ page }) => {
  await loginAdmin(page);
  await page.goto("http://localhost:3001/staging?page=2");
  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByText("Page 2 of")).toBeVisible();
});