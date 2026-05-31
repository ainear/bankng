import { prisma } from "../packages/db/src";

async function main() {
  const verifiedDepositRates = await prisma.interestRateSnapshot.findMany({
    where: {
      rateType: "deposit",
      status: "verified",
    },
    include: {
      productVariant: {
        include: {
          product: {
            include: {
              bank: true,
            },
          },
        },
      },
    },
  });

  console.log(`Verified Deposit Rates count: ${verifiedDepositRates.length}`);
  if (verifiedDepositRates.length > 0) {
    console.log("First 3 rates sample:");
    verifiedDepositRates.slice(0, 3).forEach((r, idx) => {
      console.log(`[${idx+1}] Bank: ${r.productVariant.product.bank.name} (${r.productVariant.product.bank.slug}), Rate: ${r.rateValue}%, Term: ${r.termValue} months`);
    });
  }

  const allRates = await prisma.interestRateSnapshot.findMany({
    take: 5,
    include: {
      productVariant: {
        include: {
          product: {
            include: {
              bank: true,
            },
          },
        },
      },
    },
  });
  console.log("All rates sample (first 5):");
  allRates.forEach((r, idx) => {
    console.log(`[${idx+1}] Bank: ${r.productVariant.product.bank.name}, Rate: ${r.rateValue}%, Term: ${r.termValue} months, Type: ${r.rateType}, Status: ${r.status}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
