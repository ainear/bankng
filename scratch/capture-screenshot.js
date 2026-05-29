const { chromium } = require('@playwright/test');

async function run() {
  console.log("📸 Capturing new high-res screenshot on Production...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1200 }
  });
  const page = await context.newPage();
  
  try {
    await page.goto('https://bankng-prod.vercel.app', { waitUntil: 'networkidle' });
    
    // Đợi 2 giây cho animations load
    await page.waitForTimeout(2000);
    
    const screenshotPath = '/Users/gray/.gemini/antigravity/brain/688b491b-2d69-45a8-93fa-7b2d26e217c0/homepage_screenshot.png';
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`✅ Screenshot updated successfully!`);
  } catch (err) {
    console.error("❌ Error capturing:", err);
  } finally {
    await browser.close();
  }
}

run();
