import { expect, test } from "@playwright/test";

test("web homepage renders foundation shell", async ({ page }) => {
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  await expect(page.locator("h1")).toContainText("So sanh san pham ngan hang");
  await expect(page.getByRole("button", { name: "So sanh san pham" })).toBeVisible();
});

test("public compare and detail routes render seeded public catalog", async ({ page }) => {
  await page.goto("http://localhost:3000/compare/gui-tiet-kiem");
  await expect(page.getByRole("heading", { name: "Gui tiet kiem" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bo loc compare" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bang so sanh" })).toBeVisible();
  await expect(page.getByLabel("Sap xep")).toBeVisible();
  await expect(page.getByText("Nguon du lieu & canh bao")).toBeVisible();
  await expect(page.getByRole("button", { name: "Gui yeu cau tu van" })).toBeVisible();
  await page.getByLabel("Ho va ten").fill("Test Compare Lead");
  await page.getByLabel("So dien thoai").fill("0900000001");
  await page.getByRole("button", { name: "Gui yeu cau tu van" }).click();
  await expect(page.getByText("Da ghi nhan lead")).toBeVisible();
  await page.getByLabel("Ho va ten").fill("Test Compare Lead");
  await page.getByLabel("So dien thoai").fill("0900000001");
  await page.getByRole("button", { name: "Gui yeu cau tu van" }).click();
  await expect(page.getByText("Lead da ton tai")).toBeVisible();

  await page.goto("http://localhost:3000/product/demo-bank-tiet-kiem-online");
  await expect(page.getByRole("heading", { name: "Tiet kiem online Demo Bank" })).toBeVisible();
  await expect(page.getByText("Nguon du lieu & canh bao")).toBeVisible();
  await expect(page.getByRole("button", { name: "Gui yeu cau tu van" })).toBeVisible();
  await page.getByLabel("Ho va ten").fill("Test Product Lead");
  await page.getByLabel("So dien thoai").fill("0900000002");
  await page.getByRole("button", { name: "Gui yeu cau tu van" }).click();
  await expect(page.getByText("Da ghi nhan lead")).toBeVisible();

  await page.goto("http://localhost:3000/bank/demo-bank");
  await expect(page.getByRole("heading", { name: "Demo Bank" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Gui yeu cau tu van" })).toBeVisible();
  await page.getByLabel("Ho va ten").fill("Test Bank Lead");
  await page.getByLabel("So dien thoai").fill("0900000003");
  await page.getByRole("button", { name: "Gui yeu cau tu van" }).click();
  await expect(page.getByText("Da ghi nhan lead")).toBeVisible();
});
