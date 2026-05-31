import { prisma } from "../packages/db/src";

async function main() {
  const banks = await prisma.bank.findMany({
    orderBy: { slug: "asc" }
  });

  console.log(`Total banks in DB: ${banks.length}`);
  banks.forEach((b, idx) => {
    console.log(`[${idx+1}] ID: ${b.id}, Slug: ${b.slug}, Name: ${b.name}, ShortName: ${b.shortName}, LogoUrl: ${b.logoUrl}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
