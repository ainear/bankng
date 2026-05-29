const { chromium } = require('@playwright/test');

async function run() {
  console.log("🚀 Checking computed CSS styles on Production...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://bankng-prod.vercel.app', { waitUntil: 'networkidle' });
    
    // Lấy computed style của header div (nơi dùng flex, mx-auto, max-w-6xl)
    const headerDivStyle = await page.evaluate(() => {
      const el = document.querySelector('header > div');
      if (!el) return 'No header div found';
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        justifyContent: style.justifyContent,
        alignItems: style.alignItems,
        maxWidth: style.maxWidth,
        padding: style.padding
      };
    });
    
    console.log('Computed style of header inner container:', headerDivStyle);
    
    // Lấy computed style của hero section h1 (nơi dùng text-3xl font-bold)
    const h1Style = await page.evaluate(() => {
      const el = document.querySelector('h1');
      if (!el) return 'No h1 found';
      const style = window.getComputedStyle(el);
      return {
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        color: style.color
      };
    });
    console.log('Computed style of H1:', h1Style);

    // Lấy computed style của category grid (nơi dùng grid, grid-cols-3)
    const gridStyle = await page.evaluate(() => {
      const el = document.querySelector('section div.grid');
      if (!el) return 'No grid found';
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        gridTemplateColumns: style.gridTemplateColumns,
        gap: style.gap
      };
    });
    console.log('Computed style of quick links grid:', gridStyle);
    
  } catch (err) {
    console.error("❌ Error checking:", err);
  } finally {
    await browser.close();
  }
}

run();
