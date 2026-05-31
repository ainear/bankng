import { prisma } from "../packages/db/src";

async function main() {
  const bankCount = await prisma.bank.count();
  const catCount = await prisma.productCategory.count();
  const prodCount = await prisma.financialProduct.count();
  const variantCount = await prisma.productVariant.count();
  const rateCount = await prisma.interestRateSnapshot.count();
  const crawlJobCount = await prisma.crawlJob.count();
  const stagingRateCount = await prisma.crawlStagingRate.count();

  console.log("=== DATABASE CHECK STATUS ===");
  console.log(`Banks: ${bankCount}`);
  console.log(`Product Categories: ${catCount}`);
  console.log(`Financial Products: ${prodCount}`);
  console.log(`Product Variants: ${variantCount}`);
  console.log(`Interest Rate Snapshots: ${rateCount}`);
  console.log(`Crawl Jobs: ${crawlJobCount}`);
  console.log(`Crawl Staging Rates: ${stagingRateCount}`);
  console.log("=============================");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
