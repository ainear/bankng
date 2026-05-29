/**
 * Seed script cho dự án Bankng
 * Chạy: npm run db:seed (từ packages/db)
 * Sử dụng upsert để idempotent - có thể chạy nhiều lần mà không bị lỗi
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const BANKS = [
  // Big 4
  { slug: "vietcombank", name: "Ngân hàng TMCP Ngoại thương Việt Nam", shortName: "Vietcombank", websiteUrl: "https://vietcombank.com.vn", logoUrl: "https://cdn.bankng.vn/logos/vietcombank.png" },
  { slug: "vietinbank",  name: "Ngân hàng TMCP Công thương Việt Nam",  shortName: "VietinBank",  websiteUrl: "https://vietinbank.vn",      logoUrl: "https://cdn.bankng.vn/logos/vietinbank.png"  },
  { slug: "bidv",        name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam", shortName: "BIDV", websiteUrl: "https://bidv.com.vn", logoUrl: "https://cdn.bankng.vn/logos/bidv.png" },
  { slug: "agribank",    name: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam", shortName: "Agribank", websiteUrl: "https://agribank.com.vn", logoUrl: "https://cdn.bankng.vn/logos/agribank.png" },

  // Ngân hàng tư nhân lớn
  { slug: "vpbank",      name: "Ngân hàng TMCP Việt Nam Thịnh Vượng",  shortName: "VPBank",      websiteUrl: "https://vpbank.com.vn",     logoUrl: "https://cdn.bankng.vn/logos/vpbank.png"     },
  { slug: "techcombank", name: "Ngân hàng TMCP Kỹ Thương Việt Nam",    shortName: "Techcombank", websiteUrl: "https://techcombank.com.vn", logoUrl: "https://cdn.bankng.vn/logos/techcombank.png" },
  { slug: "mbbank",      name: "Ngân hàng TMCP Quân đội",              shortName: "MBBank",      websiteUrl: "https://mbbank.com.vn",     logoUrl: "https://cdn.bankng.vn/logos/mbbank.png"     },
  { slug: "acb",         name: "Ngân hàng TMCP Á Châu",                shortName: "ACB",         websiteUrl: "https://acb.com.vn",        logoUrl: "https://cdn.bankng.vn/logos/acb.png"        },
  { slug: "tpbank",      name: "Ngân hàng TMCP Tiên Phong",            shortName: "TPBank",      websiteUrl: "https://tpbank.vn",         logoUrl: "https://cdn.bankng.vn/logos/tpbank.png"     },
  { slug: "shb",         name: "Ngân hàng TMCP Sài Gòn - Hà Nội",     shortName: "SHB",         websiteUrl: "https://shb.com.vn",        logoUrl: "https://cdn.bankng.vn/logos/shb.png"        },
  { slug: "sacombank",   name: "Ngân hàng TMCP Sài Gòn Thương Tín",   shortName: "Sacombank",   websiteUrl: "https://sacombank.com.vn",  logoUrl: "https://cdn.bankng.vn/logos/sacombank.png"  },
  { slug: "hdbank",      name: "Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh", shortName: "HDBank", websiteUrl: "https://hdbank.com.vn", logoUrl: "https://cdn.bankng.vn/logos/hdbank.png" },
  { slug: "eximbank",    name: "Ngân hàng TMCP Xuất Nhập Khẩu Việt Nam", shortName: "Eximbank", websiteUrl: "https://eximbank.com.vn", logoUrl: "https://cdn.bankng.vn/logos/eximbank.png" },
  { slug: "scb",         name: "Ngân hàng TMCP Sài Gòn",               shortName: "SCB",         websiteUrl: "https://scb.com.vn",        logoUrl: "https://cdn.bankng.vn/logos/scb.png"        },
  { slug: "bacabank",    name: "Ngân hàng TMCP Bắc Á",                 shortName: "BAC A BANK",  websiteUrl: "https://bacabank.com.vn",   logoUrl: "https://cdn.bankng.vn/logos/bacabank.png"   },
  { slug: "seabank",     name: "Ngân hàng TMCP Đông Nam Á",            shortName: "SeABank",     websiteUrl: "https://seabank.com.vn",   logoUrl: "https://cdn.bankng.vn/logos/seabank.png"    },
  { slug: "ocb",         name: "Ngân hàng TMCP Phương Đông",           shortName: "OCB",         websiteUrl: "https://ocb.com.vn",        logoUrl: "https://cdn.bankng.vn/logos/ocb.png"        },

  // Ngân hàng nước ngoài
  { slug: "shinhanbank",       name: "Ngân hàng Shinhan Việt Nam",               shortName: "Shinhan Bank",        websiteUrl: "https://shinhan.com.vn",      logoUrl: "https://cdn.bankng.vn/logos/shinhanbank.png"       },
  { slug: "hsbc",              name: "Ngân hàng TNHH MTV HSBC Việt Nam",         shortName: "HSBC",                websiteUrl: "https://hsbc.com.vn",          logoUrl: "https://cdn.bankng.vn/logos/hsbc.png"              },
  { slug: "standardchartered", name: "Ngân hàng Standard Chartered Việt Nam",    shortName: "Standard Chartered",  websiteUrl: "https://sc.com/vn",             logoUrl: "https://cdn.bankng.vn/logos/standardchartered.png" },
  { slug: "citibank",          name: "Ngân hàng Citibank Việt Nam",              shortName: "Citibank",            websiteUrl: "https://citibank.com.vn",       logoUrl: "https://cdn.bankng.vn/logos/citibank.png"          },
  { slug: "publicbank",        name: "Ngân hàng Public Bank Việt Nam",           shortName: "Public Bank",         websiteUrl: "https://publicbank.com.vn",     logoUrl: "https://cdn.bankng.vn/logos/publicbank.png"        },
  { slug: "cimb",              name: "Ngân hàng CIMB Việt Nam",                  shortName: "CIMB",                websiteUrl: "https://cimb.com.vn",           logoUrl: "https://cdn.bankng.vn/logos/cimb.png"              },
  { slug: "uob",               name: "Ngân hàng UOB Việt Nam",                   shortName: "UOB",                 websiteUrl: "https://uob.com.vn",            logoUrl: "https://cdn.bankng.vn/logos/uob.png"               },
  { slug: "wooribank",         name: "Ngân hàng Woori Việt Nam",                 shortName: "Woori Bank",          websiteUrl: "https://wooribank.com.vn",      logoUrl: "https://cdn.bankng.vn/logos/wooribank.png"         },
  { slug: "vib",               name: "Ngân hàng TMCP Quốc tế Việt Nam",          shortName: "VIB",                 websiteUrl: "https://vib.com.vn",            logoUrl: "https://cdn.bankng.vn/logos/vib.png"               },
  { slug: "lpbank",            name: "Ngân hàng TMCP Lộc Phát Việt Nam",         shortName: "LPBank",              websiteUrl: "https://lpbank.com.vn",         logoUrl: "https://cdn.bankng.vn/logos/lpbank.png"            },
];

const PRODUCT_CATEGORIES = [
  { slug: "tiet-kiem",    name: "Tiết kiệm",    compareEnabled: true, isActive: true },
  { slug: "vay-mua-nha",  name: "Vay mua nhà",  compareEnabled: true, isActive: true },
  { slug: "vay-mua-xe",   name: "Vay mua xe",   compareEnabled: true, isActive: true },
  { slug: "vay-tieu-dung",name: "Vay tiêu dùng",compareEnabled: true, isActive: true },
  { slug: "the-tin-dung", name: "Thẻ tín dụng", compareEnabled: true, isActive: true },
  { slug: "vay-kinh-doanh", name: "Vay kinh doanh", compareEnabled: true, isActive: true },
  { slug: "vay-tin-chap",   name: "Vay tín chấp",   compareEnabled: true, isActive: true },
];

const ARTICLE_CATEGORIES = [
  { slug: "tin-tuc",  name: "Tin tức",   sortOrder: 1 },
  { slug: "cam-nang", name: "Cẩm nang",  sortOrder: 2 },
  { slug: "phan-tich",name: "Phân tích", sortOrder: 3 },
  { slug: "khuyen-mai",name:"Khuyến mãi",sortOrder: 4 },
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function main() {
  console.log("🌱 Bắt đầu seed dữ liệu...\n");

  // ── 1. Admin user ──────────────────────────────────────────────────────────
  console.log("👤 Tạo admin user...");
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@bankng.vn" },
    update: {},
    create: {
      email: "admin@bankng.vn",
      // bcrypt hash của "Admin@123456" với salt 10
      passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmYzZTEabu/sMsyGRFDvmsl7wHVpqG",
      status: "active",
      emailVerifiedAt: new Date(),
      profile: {
        create: {
          fullName: "Bankng Admin",
        },
      },
    },
    include: { profile: true },
  });
  console.log(`   ✅ Admin: ${adminUser.email}\n`);

  // ── 1b. Banker user ──────────────────────────────────────────────────────────
  console.log("👤 Tạo banker user...");
  // Lấy ID TPBank để liên kết (nếu TPBank được seed)
  const tpbank = await prisma.bank.findFirst({ where: { slug: "tpbank" } });
  const bankerUser = await prisma.user.upsert({
    where: { email: "banker@bankng.vn" },
    update: {},
    create: {
      email: "banker@bankng.vn",
      passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmYzZTEabu/sMsyGRFDvmsl7wHVpqG", // Admin@123456
      status: "active",
      emailVerifiedAt: new Date(),
      profile: {
        create: {
          fullName: "Nguyễn Văn Banker",
        },
      },
      bankerProfile: {
        create: {
          slug: "nguyen-van-banker",
          title: "Chuyên viên tư vấn tín dụng",
          bio: "Hỗ trợ các gói vay mua nhà, vay kinh doanh tại TPBank với lãi suất ưu đãi nhất.",
          cityName: "Hà Nội",
          provinceCode: "01",
          isVerified: true,
          isActive: true,
          bankId: tpbank ? tpbank.id : undefined,
        },
      },
    },
  });
  console.log(`   ✅ Banker: ${bankerUser.email}\n`);

  // ── 2. Admin role & permission ─────────────────────────────────────────────
  console.log("🔑 Tạo roles & permissions...");
  const adminPermission = await prisma.permission.upsert({
    where: { code: "admin.all" },
    update: {},
    create: { code: "admin.all", name: "Quyền quản trị toàn bộ hệ thống" },
  });

  const adminRole = await prisma.role.upsert({
    where: { code: "admin" },
    update: {},
    create: {
      code: "admin",
      name: "Quản trị viên",
      permissions: {
        create: { permissionId: adminPermission.id },
      },
    },
  });

  // Gán role admin cho admin user (nếu chưa có)
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  });
  console.log("   ✅ Role admin đã được tạo và gán\n");

  // ── 3. Banks ───────────────────────────────────────────────────────────────
  console.log(`🏦 Tạo ${BANKS.length} ngân hàng...`);
  for (const bank of BANKS) {
    await prisma.bank.upsert({
      where: { slug: bank.slug },
      update: {
        name: bank.name,
        shortName: bank.shortName,
        websiteUrl: bank.websiteUrl,
        logoUrl: bank.logoUrl,
        isActive: true,
      },
      create: {
        ...bank,
        isActive: true,
      },
    });
    process.stdout.write(`   ✅ ${bank.shortName}\n`);
  }
  console.log();

  // ── 4. Product categories ──────────────────────────────────────────────────
  console.log("📂 Tạo product categories...");
  for (const cat of PRODUCT_CATEGORIES) {
    await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, compareEnabled: cat.compareEnabled, isActive: cat.isActive },
      create: cat,
    });
    console.log(`   ✅ ${cat.name}`);
  }
  console.log();

  // ── 5. Article categories ──────────────────────────────────────────────────
  console.log("📰 Tạo article categories...");
  for (const cat of ARTICLE_CATEGORIES) {
    await prisma.articleCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder },
      create: cat,
    });
    console.log(`   ✅ ${cat.name}`);
  }
  console.log();

  // ── 6. Rate source ─────────────────────────────────────────────────────────
  console.log("📡 Tạo rate source...");
  // RateSource không có unique slug, dùng findFirst + create nếu chưa có
  const existingSource = await prisma.rateSource.findFirst({
    where: { sourceName: "Bankng Editorial" },
  });
  if (!existingSource) {
    await prisma.rateSource.create({
      data: {
        sourceName: "Bankng Editorial",
        sourceType: "manual",
        reliabilityScore: 90,
      },
    });
    console.log("   ✅ Rate source 'Bankng Editorial' đã được tạo\n");
  } else {
    console.log("   ⏭️  Rate source 'Bankng Editorial' đã tồn tại, bỏ qua\n");
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  const [userCount, bankCount, catCount, artCatCount, sourceCount] = await Promise.all([
    prisma.user.count(),
    prisma.bank.count(),
    prisma.productCategory.count(),
    prisma.articleCategory.count(),
    prisma.rateSource.count(),
  ]);

  console.log("═══════════════════════════════════════");
  console.log("✅ Seed hoàn thành!");
  console.log(`   Users:               ${userCount}`);
  console.log(`   Banks:               ${bankCount}`);
  console.log(`   Product categories:  ${catCount}`);
  console.log(`   Article categories:  ${artCatCount}`);
  console.log(`   Rate sources:        ${sourceCount}`);
  console.log("═══════════════════════════════════════");
}

main()
  .catch((e) => {
    console.error("❌ Seed thất bại:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
