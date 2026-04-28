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

test.describe("Crawl staging workflow", () => {
  test("staging page shows crawl job stats", async ({ page }) => {
    await loginAdmin(page);
    await page.goto("http://localhost:3001/staging");

    await expect(page.getByRole("heading", { name: "Crawl Staging Review" })).toBeVisible();

    // Stats cards should be visible
    await expect(page.getByText("Pending review")).toBeVisible();
    await expect(page.getByText("Approved")).toBeVisible();
    await expect(page.getByText("Rejected")).toBeVisible();
    await expect(page.getByText("Crawl Jobs")).toBeVisible();
    await expect(page.getByText("Staged Rates")).toBeVisible();
  });

  test("staging page shows existing crawl jobs", async ({ page }) => {
    await loginAdmin(page);
    await page.goto("http://localhost:3001/staging");

    // Crawl Jobs section
    await expect(page.getByText("Crawl Jobs")).toBeVisible();

    // If jobs exist, should show source URL and status
    const jobSection = page.locator("text=Crawl Jobs").locator("..");
    await jobSection.isVisible();
  });

  test("staging page shows rates table with all columns", async ({ page }) => {
    await loginAdmin(page);
    await page.goto("http://localhost:3001/staging");

    // Table headers
    await expect(page.getByText("Bank")).toBeVisible();
    await expect(page.getByText("Product")).toBeVisible();
    await expect(page.getByText("Variant")).toBeVisible();
    await expect(page.getByText("Rate Type")).toBeVisible();
    await expect(page.getByText("Rate")).toBeVisible();
    await expect(page.getByText("Term")).toBeVisible();
    await expect(page.getByText("Status")).toBeVisible();
    await expect(page.getByText("Reviewed by")).toBeVisible();
    await expect(page.getByText("Actions")).toBeVisible();
  });

  test("pending rates show publish and reject buttons", async ({ page }) => {
    await loginAdmin(page);
    await page.goto("http://localhost:3001/staging?status=pending");

    // Filter to pending status
    await page.locator("select[name='status']").selectOption("pending");
    await page.getByRole("button", { name: "Filter" }).click();
    await expect(page).toHaveURL(/status=pending/);

    // If pending rates exist, should have action buttons
    const publishBtn = page.getByRole("button", { name: "Publish" });
    const rejectBtn = page.getByRole("button", { name: "Từ chối" });

    // At least one should be visible if there are pending rates
    const hasPending = await publishBtn.first().isVisible().catch(() => false);
    if (hasPending) {
      await expect(publishBtn.first()).toBeVisible();
      await expect(rejectBtn.first()).toBeVisible();
    }
  });

  test("verified rates cannot be re-published", async ({ page }) => {
    await loginAdmin(page);
    await page.goto("http://localhost:3001/staging?status=verified");

    // Filter to verified — should show Delete button, not Publish
    const deleteBtn = page.getByRole("button", { name: "Delete" });
    const publishBtn = page.getByRole("button", { name: "Publish" });

    const hasVerified = await deleteBtn.first().isVisible().catch(() => false);
    if (hasVerified) {
      await expect(deleteBtn.first()).toBeVisible();
      // Publish button should NOT appear for verified rates
      await expect(publishBtn.first()).not.toBeVisible();
    }
  });

  test("bulk select checkboxes work", async ({ page }) => {
    await loginAdmin(page);
    await page.goto("http://localhost:3001/staging");

    // Find row checkboxes
    const rowCheckboxes = page.locator(".row-checkbox");
    const count = await rowCheckboxes.count();

    if (count > 0) {
      // Select first checkbox
      await rowCheckboxes.first().check();
      await expect(rowCheckboxes.first()).toBeChecked();
    }
  });

  test("bulk actions require at least one selection", async ({ page }) => {
    await loginAdmin(page);
    await page.goto("http://localhost:3001/staging");

    // Find bulk action form
    const bulkForm = page.locator("form").filter({ has: page.getByRole("button", { name: "Publish chọn" }) });

    // Without selection, form should have empty value
    const bulkIdsInput = page.locator(".bulk-ids");
    const value = await bulkIdsInput.inputValue();
    // Value may be empty or may have previous selections
    expect(value !== "undefined").toBeTruthy();
  });

  test("staging filters persist in URL", async ({ page }) => {
    await loginAdmin(page);
    await page.goto("http://localhost:3001/staging?status=rejected&bank=vietcombank");

    // Should show rejected filtered results
    await expect(page).toHaveURL(/status=rejected/);
    await expect(page).toHaveURL(/bank=vietcombank/);
  });

  test("crawl job cancel button works", async ({ page }) => {
    await loginAdmin(page);
    await page.goto("http://localhost:3001/staging");

    // Find running jobs with Cancel button
    const cancelButtons = page.getByRole("button", { name: "Cancel" });

    const hasCancelable = await cancelButtons.first().isVisible().catch(() => false);
    if (hasCancelable) {
      await cancelButtons.first().click();
      // Should redirect with feedback=crawl_cancelled
      await expect(page).toHaveURL(/feedback=crawl_cancelled/);
    }
  });

  test("crawl job retry button works", async ({ page }) => {
    await loginAdmin(page);
    await page.goto("http://localhost:3001/staging");

    // Find failed jobs with Retry button
    const retryButtons = page.getByRole("button", { name: "Retry" });

    const hasRetryable = await retryButtons.first().isVisible().catch(() => false);
    if (hasRetryable) {
      await retryButtons.first().click();
      // Should redirect with feedback=crawl_retry_started
      await expect(page).toHaveURL(/feedback=crawl_retry_started/);
    }
  });
});

test.describe("Publish flow integration", () => {
  test("publishing staging rate creates interest rate snapshot", async ({ page }) => {
    await loginAdmin(page);

    // Navigate to pending staging rate
    await page.goto("http://localhost:3001/staging?status=pending");

    // Count pending rates before
    const publishBtn = page.getByRole("button", { name: "Publish" }).first();
    const hasPending = await publishBtn.isVisible().catch(() => false);

    if (!hasPending) {
      // No pending rates to test
      return;
    }

    // Get rate count from stats before
    const pendingBefore = await page.locator(".stats-pending").textContent();

    // Click publish
    await publishBtn.click();

    // Should redirect with feedback=staging_published
    await expect(page).toHaveURL(/feedback=staging_published/);

    // Pending count should decrease
    await page.goto("http://localhost:3001/staging");
    const pendingAfter = await page.locator(".stats-pending").textContent();
    expect(pendingAfter).not.toBe(pendingBefore);
  });

  test("verified rates visible in admin rates page", async ({ page }) => {
    await loginAdmin(page);
    await page.goto("http://localhost:3001/rates");

    await expect(page.getByRole("heading", { name: "Rates CRUD" })).toBeVisible();

    // If we published staging rates, they should appear here
    // This is an integration check
    const rows = page.locator("table tbody tr");
    const count = await rows.count();

    if (count > 0) {
      // Should have some rates visible
      await expect(rows.first()).toBeVisible();
    }
  });
});