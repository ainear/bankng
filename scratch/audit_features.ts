import { chromium } from "playwright";

async function main() {
  console.log("🔍 Bắt đầu sử dụng Playwright khảo sát sâu toàn bộ site nganhang.com...");
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  const urls = [
    "https://nganhang.com",
    "https://nganhang.com/tin-tuc",
    "https://nganhang.com/danh-sach-bankers",
    "https://nganhang.com/san-pham-cong-dong",
    "https://nganhang.com/cong-cu-tinh",
    "https://nganhang.com/thuat-ngu"
  ];

  for (const url of urls) {
    try {
      console.log(`\n----------------------------------------`);
      console.log(`🌍 Auditing: ${url}`);
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      
      // Lấy Title & Meta Description
      const title = await page.title();
      const metaDesc = await page.locator("meta[name='description']").getAttribute("content").catch(() => "N/A");
      console.log(`📌 Title: ${title}`);
      console.log(`📌 Description: ${metaDesc}`);

      // Lấy tất cả H2 và H3 trên trang để hiểu các section
      const headings = await page.evaluate(() => {
        const h2s = Array.from(document.querySelectorAll("h2")).map(h => `[H2] ${h.textContent?.trim()}`);
        const h3s = Array.from(document.querySelectorAll("h3")).map(h => `[H3] ${h.textContent?.trim()}`);
        return [...h2s, ...h3s].slice(0, 15);
      });
      console.log(`🧱 Các Section chính tìm thấy:`);
      headings.forEach(h => console.log(`   - ${h}`));

      // Lấy tất cả các đường link chính (a) để tìm các tính năng ẩn
      const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("a"))
          .map(a => ({
            text: a.textContent?.trim() || "",
            href: a.getAttribute("href") || ""
          }))
          .filter(link => link.href && !link.href.startsWith("javascript") && !link.href.startsWith("#"))
          .slice(0, 20);
      });
      console.log(`🔗 Các Link điều hướng/Tính năng mẫu:`);
      links.forEach(l => console.log(`   - ${l.text} -> ${l.href}`));

      // Kiểm tra xem có form hay component tương tác đặc biệt nào không
      const interactiveElements = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button")).map(b => b.textContent?.trim()).filter(Boolean);
        const inputs = Array.from(document.querySelectorAll("input, select, textarea")).map(i => i.getAttribute("placeholder") || i.getAttribute("name")).filter(Boolean);
        return { buttons: buttons.slice(0, 10), inputs: inputs.slice(0, 10) };
      });
      console.log(`⚙️ Các nút bấm/Form Inputs tương tác:`);
      console.log(`   - Buttons: ${interactiveElements.buttons.join(", ")}`);
      console.log(`   - Inputs: ${interactiveElements.inputs.join(", ")}`);

    } catch (err) {
      console.error(`❌ Lỗi khi audit ${url}:`, err instanceof Error ? err.message : String(err));
    }
  }

  await browser.close();
  console.log("\n✅ Hoàn tất khảo sát bằng Playwright!");
}

main().catch(console.error);
