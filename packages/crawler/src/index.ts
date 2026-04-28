import { prisma } from "@bankng/db";
import { PrismaClient } from "@prisma/client";
import { launchBrowser, runCrawl } from "./crawler";
import { stagingRateSchema, crawlConfig } from "./types";
import { randomUUID } from "node:crypto";

async function main() {
  const jobId = randomUUID();
  const startedAt = new Date();

  console.log(`[Job ${jobId}] Starting crawl of ${crawlConfig.pages.length} pages from ${crawlConfig.baseUrl}`);

  const crawlJob = await prisma.crawlJob.create({
    data: {
      id: jobId,
      sourceUrl: crawlConfig.baseUrl,
      status: "running",
      startedAt
    }
  });

  let pagesCrawled = 0;
  let totalRates = 0;
  let totalBanks = 0;
  const allErrors: string[] = [];

  try {
    const { browser, page } = await launchBrowser();

    try {
      const results = await runCrawl(jobId, page);

      for (const result of results) {
        pagesCrawled++;
        totalBanks += result.banks.length;
        allErrors.push(...result.errors);

        for (const rawRate of result.rates) {
          const parsed = stagingRateSchema.safeParse(rawRate);
          if (parsed.success) {
            await prisma.crawlStagingRate.create({
              data: {
                crawlJobId: jobId,
                bankSlug: parsed.data.bankSlug,
                bankName: parsed.data.bankName,
                productName: parsed.data.productName,
                variantName: parsed.data.variantName,
                rateType: parsed.data.rateType,
                termValue: parsed.data.termValue,
                termUnit: parsed.data.termUnit,
                rateValue: parsed.data.rateValue,
                rateUnit: parsed.data.rateUnit,
                minAmount: parsed.data.minAmount,
                maxAmount: parsed.data.maxAmount,
                effectiveFrom: parsed.data.effectiveFrom,
                effectiveTo: parsed.data.effectiveTo ?? undefined,
                provinceCode: parsed.data.provinceCode,
                rawData: parsed.data.rawData ? JSON.parse(JSON.stringify(parsed.data.rawData)) : undefined,
                status: "pending"
              }
            });
            totalRates++;
          } else {
            allErrors.push(`Invalid rate data: ${JSON.stringify(parsed.error.format())}`);
          }
        }
      }
    } finally {
      await browser.close();
    }

    await prisma.crawlJob.update({
      where: { id: jobId },
      data: {
        status: "completed",
        pagesCrawled,
        itemsFound: totalRates,
        finishedAt: new Date()
      }
    });

    console.log(`[Job ${jobId}] Completed: ${pagesCrawled} pages, ${totalRates} rates, ${totalBanks} banks`);
    if (allErrors.length > 0) {
      console.log(`[Job ${jobId}] Errors: ${allErrors.length}`);
      allErrors.forEach((e) => console.log(`  - ${e}`));
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    allErrors.push(`Job failed: ${errorMsg}`);

    await prisma.crawlJob.update({
      where: { id: jobId },
      data: {
        status: "failed",
        errorMsg,
        pagesCrawled,
        itemsFound: totalRates,
        finishedAt: new Date()
      }
    });

    console.error(`[Job ${jobId}] Failed: ${errorMsg}`);
    process.exit(1);
  }
}

main()
  .catch((err) => {
    console.error("Unhandled error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());