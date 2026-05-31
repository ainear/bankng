import { expect, test } from "@playwright/test";

test("web homepage renders foundation shell", async ({ page }) => {
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  await expect(page.locator("h1")).toContainText("So sanh san pham ngan hang");
  await expect(page.getByRole("button", { name: "So sanh san pham" })).toBeVisible();
});

test("homepage interactive lead form submit flow", async ({ page }) => {
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  // Kiểm tra xem Form có xuất hiện không
  const formSection = page.locator("#consultation-form");
  await expect(formSection).toBeVisible();

  // Điền thông tin giả lập
  await page.locator("#fullname").fill("Nguyễn Văn A");
  await page.locator("#phone").fill("0912345678");
  await page.locator("#email").fill("test.lead@example.com");
  await page.locator("#province").selectOption("HN"); // Hà Nội
  
  // Chọn ngân hàng đầu tiên có sẵn trong dropdown
  await page.locator("#bank").selectOption({ index: 1 });
  
  await page.locator("#message").fill("Tôi cần tư vấn gói vay mua nhà lãi suất thấp nhất.");

  // Nhấn nút gửi
  await page.getByRole("button", { name: /Gửi thông tin đăng ký nhanh/i }).click();

  // Chờ hiển thị thông báo thành công
  const statusAlert = page.locator("#consultation-form").locator(".transition-all");
  await expect(statusAlert).toBeVisible();
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
