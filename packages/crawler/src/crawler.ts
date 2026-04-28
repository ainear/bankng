import { chromium, type Page } from "playwright";
import { crawlConfig, type CrawlPageResult, type StagingRateInput } from "./types";

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRateValue(text: string): number | null {
  const match = text.replace(",", ".").match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

function parseTerm(text: string): { value: number; unit: string } | null {
  const match = text.match(/(\d+)\s*(tháng|nam|ngày)/i);
  if (!match) return null;
  return { value: parseInt(match[1]), unit: match[2].toLowerCase().startsWith("t") ? "tháng" : match[2] };
}

async function crawlPage(page: Page, url: string): Promise<CrawlPageResult> {
  const result: CrawlPageResult = { url, rates: [], banks: [], errors: [] };

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: crawlConfig.timeoutMs });
    await delay(crawlConfig.delayMs);

    // Extract bank names from sidebar or list
    const bankLinks = await page.locator("a[href*='/bank/']").all();
    const seenSlugs = new Set<string>();
    for (const link of bankLinks) {
      const href = await link.getAttribute("href");
      const name = await link.textContent();
      if (href && name && !seenSlugs.has(href)) {
        seenSlugs.add(href);
        result.banks.push({
          slug: href.replace("/bank/", "").replace(/[^a-z0-9-]/g, ""),
          name: name.trim()
        });
      }
    }

    // Extract rate cards/tables
    const rateSelectors = [
      "table rate-info",
      ".rate-card",
      ".product-rate",
      "[data-rate]",
      "table tbody tr"
    ];

    for (const selector of rateSelectors) {
      try {
        const rows = await page.locator(selector).all();
        for (const row of rows) {
          const text = await row.textContent() ?? "";
          const rateMatch = text.match(/(?:lãi suất|rate)[:\s]*([\d,.]+(?:\s*%\s*|\s*phan tram))/i);
          const termMatch = text.match(/(\d+)\s*(?:tháng|nam|kỳ hạn)/i);
          const bankMatch = text.match(/(?:ngân hàng|bank)[:\s]*([A-Z][A-Za-z\s]+?)(?:\s|$|,)/i);

          if (rateMatch && termMatch) {
            const rateValue = parseRateValue(rateMatch[1]);
            const term = parseTerm(text);
            const bankName = bankMatch ? bankMatch[1].trim() : "Unknown Bank";

            result.rates.push({
              bankSlug: bankName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
              bankName,
              productName: "Loan Product",
              variantName: term ? `${term.value} tháng` : "Standard",
              rateType: "interest_rate",
              termValue: term?.value ?? null,
              termUnit: term?.unit ?? null,
              rateValue: rateValue ?? 0,
              rateUnit: "percent_per_year",
              minAmount: null,
              maxAmount: null,
              effectiveFrom: new Date(),
              effectiveTo: null,
              provinceCode: null,
              rawData: { selector, rawText: text }
            });
          }
        }
      } catch {
        // selector didn't work, try next
      }
    }
  } catch (err) {
    result.errors.push(`Failed to crawl ${url}: ${err instanceof Error ? err.message : String(err)}`);
  }

  return result;
}

export async function runCrawl(jobId: string, page: Page): Promise<CrawlPageResult[]> {
  const results: CrawlPageResult[] = [];

  for (const { path, label } of crawlConfig.pages) {
    console.log(`[Crawl ${jobId}] ${label}: ${path}`);
    const result = await crawlPage(page, `${crawlConfig.baseUrl}${path}`);
    console.log(`[Crawl ${jobId}] ${label}: ${result.rates.length} rates, ${result.banks.length} banks, ${result.errors.length} errors`);
    results.push(result);
  }

  return results;
}

export async function launchBrowser() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: crawlConfig.userAgent,
    extraHTTPHeaders: { "Accept-Language": "vi-VN,vi" }
  });
  return { browser, page: await context.newPage() };
}