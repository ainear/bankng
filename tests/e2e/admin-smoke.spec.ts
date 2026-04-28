import { expect, test, type Page } from "@playwright/test";

const adminEmail = process.env.ADMIN_EMAIL ?? "admin@bankng.local";
const adminPassword = process.env.ADMIN_PASSWORD ?? "";

async function loginAdmin(page: Page) {
  await page.goto("http://localhost:3001");
  await expect(page).toHaveURL(/\/login/);
  await page.getByLabel("Admin email").fill(adminEmail);
  await page.getByLabel("Admin password").fill(adminPassword);
  await page.getByRole("button", { name: "Dang nhap admin" }).click();
  await expect(page).toHaveURL("http://localhost:3001/");
  await expect(page.getByRole("heading", { name: "Bang dieu khien van hanh" })).toBeVisible();
}

test("admin login redirects into protected dashboard", async ({ page }) => {
  await loginAdmin(page);
  await expect(page.getByRole("heading", { name: "Audit logs" })).toBeVisible();
});

test("admin banks and rates pages render M2 modules", async ({ page }) => {
  await loginAdmin(page);

  await page.goto("http://localhost:3001/banks");
  await expect(page.getByRole("heading", { name: "Banks CRUD" })).toBeVisible();
  await expect(page.getByText("Danh sach ngan hang")).toBeVisible();

  await page.goto("http://localhost:3001/branches");
  await expect(page.getByRole("heading", { name: "Branches CRUD" })).toBeVisible();
  await expect(page.getByText("Danh sach branches")).toBeVisible();

  await page.goto("http://localhost:3001/rates");
  await expect(page.getByRole("heading", { name: "Rates CRUD" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Rate snapshots" })).toBeVisible();
});

test("admin leads page renders CRM board", async ({ page }) => {
  await loginAdmin(page);

  await page.goto("http://localhost:3001/leads");
  await expect(page.getByRole("heading", { name: "Leads CRM" })).toBeVisible();
  await expect(page.getByText("Danh sach lead")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Lead queues" })).toBeVisible();
  await page.getByLabel("Filter status").selectOption("contacted");
  await expect(page.getByText("Queue: contacted")).toBeVisible();
});

test("lead lifecycle routes public lead into admin CRM and banker inbox", async ({ page, browser }) => {
  await page.goto("http://localhost:3000/product/demo-bank-tiet-kiem-online");
  await page.getByLabel("Ho va ten").fill("Lifecycle Lead");
  await page.getByLabel("So dien thoai").fill("0900000099");
  await page.getByRole("button", { name: "Gui yeu cau tu van" }).click();
  await expect(page).toHaveURL(/feedback=lead_created/);

  await loginAdmin(page);
  await page.goto("http://localhost:3001/leads");
  const leadRow = page.locator("tr").filter({ hasText: "0900000099" }).first();
  await expect(leadRow).toBeVisible();
  await leadRow.getByLabel("Trang thai").selectOption("contacted");
  await leadRow.getByLabel("Gan cho").selectOption({ label: "banker@bankng.local" });
  await leadRow.getByRole("button", { name: "Luu lead" }).click();
  await expect(page.getByText("Da cap nhat lead")).toBeVisible();

  const bankerPage = await browser.newPage();
  await bankerPage.goto("http://localhost:3002/leads");
  await expect(bankerPage.getByRole("heading", { name: "Lead inbox" })).toBeVisible();
  const bankerLeadCard = bankerPage.locator("section").filter({ hasText: "0900000099" }).first();
  await expect(bankerLeadCard).toBeVisible();
  await expect(bankerLeadCard).toContainText("Status: contacted");
  await bankerPage.close();
});
