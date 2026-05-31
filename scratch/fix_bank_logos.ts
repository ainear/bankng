import { prisma } from "../packages/db/src";

const VIETQR_LOGO_MAP: Record<string, string> = {
  acb: "ACB",
  agribank: "VBA",
  bacabank: "BAB",
  bidv: "BIDV",
  cimb: "CIMB",
  citibank: "CITIBANK",
  eximbank: "EIB",
  hdbank: "HDB",
  hsbc: "HSBC",
  lpbank: "LPB",
  mbbank: "MB",
  ocb: "OCB",
  publicbank: "PBVN",
  sacombank: "STB",
  scb: "SCB",
  seabank: "SEAB",
  shb: "SHB",
  shinhanbank: "SHINHAN",
  standardchartered: "SCVN",
  techcombank: "TCB",
  tpbank: "TPB",
  uob: "UOB",
  vib: "VIB",
  vietcombank: "VCB",
  vietinbank: "CTG",
  vpbank: "VPB",
  wooribank: "WOORI"
};

async function main() {
  console.log("🚀 Bắt đầu cập nhật logo ngân hàng sang VietQR CDN...");

  const banks = await prisma.bank.findMany();
  
  for (const bank of banks) {
    const code = VIETQR_LOGO_MAP[bank.slug];
    if (code) {
      const realLogoUrl = `https://cdn.vietqr.io/img/${code}.png`;
      await prisma.bank.update({
        where: { id: bank.id },
        data: {
          logoUrl: realLogoUrl
        }
      });
      console.log(`   ✅ Cập nhật logo cho: ${bank.shortName ?? bank.name} -> ${realLogoUrl}`);
    } else if (bank.slug === "demo-bank") {
      const demoLogo = "https://cdn.vietqr.io/img/VIETQR.png";
      await prisma.bank.update({
        where: { id: bank.id },
        data: {
          logoUrl: demoLogo
        }
      });
      console.log(`   ✅ Cập nhật logo cho Demo Bank -> ${demoLogo}`);
    } else {
      console.log(`   ⚠️ Không tìm thấy code mapping cho: ${bank.slug}`);
    }
  }

  console.log("🎉 Hoàn tất cập nhật 28 ngân hàng!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
