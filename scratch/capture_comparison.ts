import { chromium } from "playwright";
import * as path from "path";

async function run() {
  console.log("📸 Bắt đầu chụp ảnh màn hình so sánh giữa nganhang.com và bankng-prod.vercel.app...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1000 },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();
  
  const artifactDir = "/Users/gray/.gemini/antigravity/brain/76115df6-8f5f-4248-a003-d5d4137f3be2";

  try {
    // 1. Chụp nganhang.com
    console.log("📸 Chụp nganhang.com...");
    await page.goto("https://nganhang.com", { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(artifactDir, "nganhang_home.png") });
    console.log("✅ Chụp nganhang_home.png thành công!");

    // 2. Chụp bankng-prod.vercel.app
    console.log("📸 Chụp bankng-prod.vercel.app...");
    await page.goto("https://bankng-prod.vercel.app", { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(artifactDir, "bankng_home.png") });
    console.log("✅ Chụp bankng_home.png thành công!");

  } catch (err) {
    console.error("❌ Lỗi chụp ảnh:", err);
  } finally {
    await browser.close();
  }
}

run();
