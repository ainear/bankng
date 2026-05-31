import { chromium } from "@playwright/test";
import * as fs from "fs";

async function main() {
  console.log("🚀 Bắt đầu khảo sát chi tiết nganhang.com...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const report: any = {
    homepage: {},
    tools: {},
    compare: {},
    terminology: {}
  };

  try {
    console.log("🔍 Đang phân tích Trang chủ nganhang.com...");
    await page.goto("https://nganhang.com", { waitUntil: "networkidle", timeout: 35000 });

    // 1. Phân tích Header & Navigation
    report.homepage.navLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("header nav a, header a"));
      return links.map(l => ({
        text: l.textContent?.trim(),
        href: (l as HTMLAnchorElement).href
      })).filter(l => l.text);
    });

    // 2. Phân tích Hero Section & Widget so sánh nhanh
    report.homepage.hero = await page.evaluate(() => {
      const h1 = document.querySelector("h1")?.textContent?.trim();
      const p = document.querySelector("h1 + p, h1 ~ p")?.textContent?.trim();
      
      // Tìm các input/select so sánh trên banner
      const forms = Array.from(document.querySelectorAll("form, [class*='hero'] form, [class*='banner'] form"));
      const formFields = forms.map(f => {
        const inputs = Array.from(f.querySelectorAll("input, select, button"));
        return inputs.map(i => ({
          tag: i.tagName.toLowerCase(),
          type: (i as HTMLInputElement).type,
          placeholder: (i as HTMLInputElement).placeholder || "",
          text: i.textContent?.trim() || ""
        }));
      });

      return { h1, p, formFields };
    });

    // 3. Phân tích Bảng lãi suất và các Tab trên trang chủ
    report.homepage.ratesSection = await page.evaluate(() => {
      // Tìm tất cả các tab điều hướng bảng
      const tabs = Array.from(document.querySelectorAll("[class*='tab'], [role='tab'], button"));
      const tabTexts = tabs.map(t => t.textContent?.trim()).filter(t => t && (t.includes("tiết kiệm") || t.includes("vay") || t.includes("Lãi suất")));

      // Phân tích bảng
      const table = document.querySelector("table");
      const headers = table ? Array.from(table.querySelectorAll("th")).map(th => th.textContent?.trim()) : [];
      const rowCount = table ? table.querySelectorAll("tbody tr").length : 0;

      return { tabTexts, headers, rowCount };
    });

    // 4. Phân tích khối Bankers và Tin tức trang chủ
    report.homepage.bankersSection = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll("[class*='banker'], [class*='expert'], [class*='member']"));
      return {
        cardCount: cards.length,
        sampleText: cards[0]?.textContent?.trim() || "N/A"
      };
    });

  } catch (err) {
    console.error("❌ Lỗi cào trang chủ:", err);
    report.homepage.error = String(err);
  }

  // Khảo sát trang Công cụ tính
  try {
    console.log("🔍 Đang phân tích Trang công cụ tính nganhang.com/cong-cu-tinh...");
    await page.goto("https://nganhang.com/cong-cu-tinh", { waitUntil: "networkidle", timeout: 25000 }).catch(() => null);
    report.tools.title = await page.title();
    report.tools.toolsList = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a"));
      return links.map(l => ({
        text: l.textContent?.trim(),
        href: (l as HTMLAnchorElement).href
      })).filter(l => l.text && l.href.includes("cong-cu"));
    });
  } catch (err) {
    report.tools.error = String(err);
  }

  await browser.close();

  // Lưu báo cáo JSON
  fs.writeFileSync("/Users/gray/Documents/bankng/scratch/nganhang_structure.json", JSON.stringify(report, null, 2), "utf-8");
  console.log("🎉 Khảo sát hoàn tất! Báo cáo lưu tại scratch/nganhang_structure.json");
}

main().catch(console.error);
