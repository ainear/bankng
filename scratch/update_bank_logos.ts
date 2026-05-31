import { prisma } from "../packages/db/src";

async function main() {
  console.log("🚀 Bắt đầu cập nhật logo thực tế của 28 ngân hàng trong database...");

  const banks = await prisma.bank.findMany();
  
  for (const bank of banks) {
    const realLogoUrl = `https://raw.githubusercontent.com/vinhjaxt/vietnam-banks-logo/master/${bank.slug}.png`;
    
    await prisma.bank.update({
      where: { id: bank.id },
      data: {
        logoUrl: realLogoUrl
      }
    });
    console.log(`   ✅ Đã cập nhật logo thật cho: ${bank.shortName ?? bank.name} -> ${realLogoUrl}`);
  }

  console.log("🎉 Hoàn tất cập nhật 28 ngân hàng!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
