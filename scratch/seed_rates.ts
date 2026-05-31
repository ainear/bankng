import { prisma } from "../packages/db/src";

async function main() {
  console.log("🌱 Bắt đầu nạp dữ liệu lãi suất thực tế từ nganhang.com vào database...");

  // 1. Lấy thông tin các danh mục
  const categories = await prisma.productCategory.findMany();
  const tietKiemCat = categories.find((c) => c.slug === "tiet-kiem");
  const vayNhaCat = categories.find((c) => c.slug === "vay-mua-nha");
  const vayXeCat = categories.find((c) => c.slug === "vay-mua-xe");
  const vayTieuDungCat = categories.find((c) => c.slug === "vay-tieu-dung" || c.slug === "vay-tin-chap");
  const vayKinhDoanhCat = categories.find((c) => c.slug === "vay-kinh-doanh");

  if (!tietKiemCat || !vayNhaCat || !vayXeCat) {
    console.error("❌ Không tìm thấy đầy đủ danh mục sản phẩm. Vui lòng chạy seed.ts trước!");
    return;
  }

  // 2. Lấy thông tin các ngân hàng
  const banks = await prisma.bank.findMany();
  const bankMap = new Map(banks.map((b) => [b.slug, b]));

  // Lấy RateSource
  let rateSource = await prisma.rateSource.findFirst({
    where: { sourceName: "Bankng Editorial" },
  });
  if (!rateSource) {
    rateSource = await prisma.rateSource.create({
      data: {
        sourceName: "Bankng Editorial",
        sourceType: "manual",
        reliabilityScore: 95,
      },
    });
  }

  // Lấy Admin User để làm người tạo snapshot
  const adminUser = await prisma.user.findFirst({
    where: { email: "admin@bankng.vn" },
  });
  if (!adminUser) {
    console.error("❌ Không tìm thấy admin user. Vui lòng chạy seed.ts trước!");
    return;
  }

  const effectiveFrom = new Date("2026-05-01T00:00:00Z");

  // ---------------------------------------------------------------------------
  // DATA TIẾT KIỆM (Savings)
  // Lãi suất gửi tiết kiệm tại quầy kì hạn 1, 3, 6, 9, 12, 24, 36 tháng
  // ---------------------------------------------------------------------------
  const savingsData = [
    { bankSlug: "vietcombank", rates: { 1: 1.6, 3: 1.9, 6: 2.9, 9: 2.9, 12: 4.6, 24: 4.7, 36: 4.7 } },
    { bankSlug: "vietinbank",  rates: { 1: 1.7, 3: 2.0, 6: 3.0, 9: 3.0, 12: 4.6, 24: 4.7, 36: 4.7 } },
    { bankSlug: "bidv",        rates: { 1: 1.7, 3: 2.0, 6: 3.0, 9: 3.0, 12: 4.6, 24: 4.7, 36: 4.7 } },
    { bankSlug: "agribank",    rates: { 1: 1.6, 3: 1.9, 6: 3.0, 9: 3.0, 12: 4.6, 24: 4.7, 36: 4.7 } },
    { bankSlug: "techcombank", rates: { 1: 2.5, 3: 2.9, 6: 3.8, 9: 3.9, 12: 4.7, 24: 4.8, 36: 4.8 } },
    { bankSlug: "vpbank",      rates: { 1: 2.9, 3: 3.2, 6: 4.5, 9: 4.6, 12: 5.1, 24: 5.3, 36: 5.3 } },
    { bankSlug: "mbbank",      rates: { 1: 2.1, 3: 2.5, 6: 3.5, 9: 3.6, 12: 4.7, 24: 5.1, 36: 5.3 } },
    { bankSlug: "acb",         rates: { 1: 2.4, 3: 2.8, 6: 3.7, 9: 3.8, 12: 4.5, 24: 4.6, 36: 4.6 } },
    { bankSlug: "tpbank",      rates: { 1: 2.2, 3: 2.5, 6: 3.5, 9: 3.6, 12: 4.6, 24: 5.0, 36: 5.2 } },
    { bankSlug: "vib",         rates: { 1: 2.6, 3: 3.0, 6: 4.0, 9: 4.1, 12: 4.9, 24: 5.1, 36: 5.2 } },
    { bankSlug: "shb",         rates: { 1: 2.8, 3: 3.1, 6: 4.3, 9: 4.4, 12: 5.0, 24: 5.3, 36: 5.5 } },
    { bankSlug: "sacombank",   rates: { 1: 2.3, 3: 2.7, 6: 3.7, 9: 3.8, 12: 4.7, 24: 5.1, 36: 5.3 } },
    { bankSlug: "hdbank",      rates: { 1: 2.5, 3: 2.9, 6: 4.5, 9: 4.6, 12: 5.2, 24: 5.5, 36: 5.7 } },
    { bankSlug: "scb",         rates: { 1: 1.6, 3: 1.9, 6: 2.9, 9: 2.9, 12: 4.7, 24: 4.7, 36: 4.7 } },
    { bankSlug: "seabank",     rates: { 1: 2.7, 3: 3.0, 6: 3.8, 9: 3.9, 12: 4.8, 24: 5.2, 36: 5.4 } },
  ];

  console.log("💰 Bắt đầu nạp sản phẩm Tiết kiệm...");
  for (const item of savingsData) {
    const bank = bankMap.get(item.bankSlug);
    if (!bank) continue;

    // 2.1 Tạo Financial Product
    const prodSlug = `tiet-kiem-thuong-${bank.slug}`;
    const product = await prisma.financialProduct.upsert({
      where: { slug: prodSlug },
      update: {
        name: `Tiết kiệm thường - ${bank.shortName ?? bank.name}`,
        status: "active",
        isPublic: true,
      },
      create: {
        slug: prodSlug,
        bankId: bank.id,
        categoryId: tietKiemCat.id,
        name: `Tiết kiệm thường - ${bank.shortName ?? bank.name}`,
        shortDescription: `Sản phẩm gửi tiết kiệm thường tại quầy của ${bank.shortName ?? bank.name}`,
        longDescription: `Gửi tiết kiệm nhận lãi định kỳ hoặc cuối kỳ tại mạng lưới chi nhánh ${bank.shortName ?? bank.name} trên toàn quốc. An toàn, uy tín, bảo mật thông tin tuyệt đối.`,
        status: "active",
        isPublic: true,
      },
    });

    // 2.2 Tạo Product Variant chung cho sản phẩm
    const varSlug = `tiet-kiem-thuong-tai-quay-${bank.slug}`;
    const variant = await prisma.productVariant.upsert({
      where: { slug: varSlug },
      update: {
        variantName: "Gửi tiết kiệm tại quầy",
        status: "active",
      },
      create: {
        slug: varSlug,
        productId: product.id,
        variantName: "Gửi tiết kiệm tại quầy",
        status: "active",
      },
    });

    // 2.3 Tạo các Lãi suất cho từng kỳ hạn (months)
    for (const [monthsStr, rateVal] of Object.entries(item.rates)) {
      const termValue = parseInt(monthsStr);
      const uniqueRateKey = {
        productVariantId: variant.id,
        rateType: "savings",
        termValue,
        termUnit: "tháng",
        effectiveFrom,
        sourceId: rateSource.id,
      };

      await prisma.interestRateSnapshot.upsert({
        where: { unique_rate_snapshot: uniqueRateKey },
        update: {
          rateValue: rateVal,
          status: "verified",
        },
        create: {
          productVariantId: variant.id,
          rateType: "savings",
          termValue,
          termUnit: "tháng",
          rateValue: rateVal,
          rateUnit: "percent_per_year",
          effectiveFrom,
          sourceId: rateSource.id,
          status: "verified",
          createdById: adminUser.id,
        },
      });
    }
    console.log(`   ✅ Đã nạp Tiết kiệm cho ${bank.shortName}`);
  }

  // ---------------------------------------------------------------------------
  // DATA VAY MUA NHÀ (Mortgage)
  // Lãi suất ưu đãi năm đầu tiên của các ngân hàng lớn
  // ---------------------------------------------------------------------------
  const mortgageData = [
    { bankSlug: "vietcombank", rate: 6.0, term: 12, maxTerm: 240, desc: "Gói vay mua nhà đất, chung cư với lãi suất ưu đãi cố định 12 tháng đầu." },
    { bankSlug: "vietinbank",  rate: 6.2, term: 12, maxTerm: 240, desc: "Hỗ trợ vay mua nhà dự án liên kết với lãi suất cực tốt." },
    { bankSlug: "bidv",        rate: 6.0, term: 12, maxTerm: 240, desc: "Đồng hành mua nhà cùng BIDV, thủ tục nhanh chóng, hạn mức cao." },
    { bankSlug: "agribank",    rate: 6.5, term: 12, maxTerm: 180, desc: "Vay mua nhà ở xã hội, nhà phố khu vực nông thôn và đô thị." },
    { bankSlug: "techcombank", rate: 5.9, term: 12, maxTerm: 420, desc: "Đặc quyền vay mua nhà dự án Vinhomes kì hạn lên tới 35 năm." },
    { bankSlug: "vpbank",      rate: 6.9, term: 12, maxTerm: 300, desc: "Vay mua nhà đất thổ cư hạn mức lên đến 80% giá trị tài sản." },
    { bankSlug: "mbbank",      rate: 6.2, term: 12, maxTerm: 300, desc: "Gói vay ưu đãi mua căn hộ chung cư thủ tục giải ngân siêu tốc." },
    { bankSlug: "acb",         rate: 6.5, term: 12, maxTerm: 300, desc: "Lãi suất vay mua nhà ACB cạnh tranh, phương án trả nợ linh hoạt." },
    { bankSlug: "tpbank",      rate: 6.8, term: 12, maxTerm: 300, desc: "Vay mua nhà TPBank lãi suất hấp dẫn, duyệt hồ sơ trong 8h làm việc." },
    { bankSlug: "shinhanbank", rate: 5.8, term: 12, maxTerm: 360, desc: "Thế mạnh lãi suất cực thấp và cố định dài hạn từ ngân hàng Hàn Quốc." },
    { bankSlug: "hsbc",        rate: 6.5, term: 12, maxTerm: 300, desc: "Gói vay mua bất động sản cao cấp dành cho phân khúc khách hàng Premier." },
    { bankSlug: "standardchartered", rate: 6.4, term: 12, maxTerm: 300, desc: "Vay mua nhà Standard Chartered lãi suất cố định minh bạch." },
    { bankSlug: "uob",         rate: 6.0, term: 12, maxTerm: 300, desc: "Gói hỗ trợ tài chính mua nhà của UOB Singapore tại Việt Nam." },
  ];

  console.log("\n🏡 Bắt đầu nạp sản phẩm Vay Mua Nhà...");
  for (const item of mortgageData) {
    const bank = bankMap.get(item.bankSlug);
    if (!bank) continue;

    const prodSlug = `vay-mua-nha-${bank.slug}`;
    const product = await prisma.financialProduct.upsert({
      where: { slug: prodSlug },
      update: {
        name: `Vay mua nhà đất - ${bank.shortName ?? bank.name}`,
        status: "active",
        isPublic: true,
      },
      create: {
        slug: prodSlug,
        bankId: bank.id,
        categoryId: vayNhaCat.id,
        name: `Vay mua nhà đất - ${bank.shortName ?? bank.name}`,
        shortDescription: item.desc,
        longDescription: `${item.desc} Vay thế chấp bất động sản, chung cư, hỗ trợ hạn mức lên tới 75-80% giá trị định giá tài sản. Phương thức trả nợ linh hoạt: Trả gốc đều/Lãi giảm dần hoặc Trả đều (Annuity).`,
        status: "active",
        isPublic: true,
      },
    });

    const varSlug = `vay-mua-nha-uu-dai-${bank.slug}`;
    const variant = await prisma.productVariant.upsert({
      where: { slug: varSlug },
      update: {
        variantName: "Ưu đãi năm đầu",
        minTermMonth: 12,
        maxTermMonth: item.maxTerm,
        status: "active",
      },
      create: {
        slug: varSlug,
        productId: product.id,
        variantName: "Ưu đãi năm đầu",
        minTermMonth: 12,
        maxTermMonth: item.maxTerm,
        status: "active",
      },
    });

    const uniqueRateKey = {
      productVariantId: variant.id,
      rateType: "loan",
      termValue: item.term,
      termUnit: "tháng",
      effectiveFrom,
      sourceId: rateSource.id,
    };

    await prisma.interestRateSnapshot.upsert({
      where: { unique_rate_snapshot: uniqueRateKey },
      update: {
        rateValue: item.rate,
        status: "verified",
      },
      create: {
        productVariantId: variant.id,
        rateType: "loan",
        termValue: item.term,
        termUnit: "tháng",
        rateValue: item.rate,
        rateUnit: "percent_per_year",
        effectiveFrom,
        sourceId: rateSource.id,
        status: "verified",
        createdById: adminUser.id,
      },
    });
    console.log(`   ✅ Đã nạp Vay mua nhà cho ${bank.shortName}`);
  }

  // ---------------------------------------------------------------------------
  // DATA VAY MUA XE (Auto Loan)
  // Lãi suất ưu đãi vay mua ô tô của các ngân hàng lớn
  // ---------------------------------------------------------------------------
  const autoLoanData = [
    { bankSlug: "shinhanbank", rate: 6.2, term: 12, maxTerm: 96, desc: "Hỗ trợ vay mua xe ô tô mới với lãi suất thấp bậc nhất thị trường." },
    { bankSlug: "techcombank", rate: 7.5, term: 12, maxTerm: 96, desc: "Hạn mức cho vay mua xe lên tới 80% giá trị xe, phê duyệt hồ sơ nhanh." },
    { bankSlug: "vpbank",      rate: 8.0, term: 12, maxTerm: 96, desc: "Vay mua ô tô phục vụ nhu cầu đi lại hoặc kinh doanh vận tải." },
    { bankSlug: "vib",         rate: 7.9, term: 12, maxTerm: 96, desc: "Ngân hàng số 1 về thị phần cho vay mua ô tô tại Việt Nam." },
    { bankSlug: "tpbank",      rate: 7.8, term: 12, maxTerm: 96, desc: "Vay mua ô tô TPBank, duyệt phương án siêu tốc trong 4 giờ." },
    { bankSlug: "vietcombank", rate: 6.8, term: 12, maxTerm: 84, desc: "Vay tiêu dùng mua ô tô lãi suất cạnh tranh và ổn định." },
  ];

  console.log("\n🚗 Bắt đầu nạp sản phẩm Vay Mua Xe...");
  for (const item of autoLoanData) {
    const bank = bankMap.get(item.bankSlug);
    if (!bank) continue;

    const prodSlug = `vay-mua-xe-${bank.slug}`;
    const product = await prisma.financialProduct.upsert({
      where: { slug: prodSlug },
      update: {
        name: `Vay mua ô tô - ${bank.shortName ?? bank.name}`,
        status: "active",
        isPublic: true,
      },
      create: {
        slug: prodSlug,
        bankId: bank.id,
        categoryId: vayXeCat.id,
        name: `Vay mua ô tô - ${bank.shortName ?? bank.name}`,
        shortDescription: item.desc,
        longDescription: `${item.desc} Vay thế chấp bằng chính chiếc xe mua hoặc bất động sản khác. Hỗ trợ cho cả xe mới và xe cũ với kì hạn trả góp dài, thủ tục đơn giản.`,
        status: "active",
        isPublic: true,
      },
    });

    const varSlug = `vay-mua-xe-uu-dai-${bank.slug}`;
    const variant = await prisma.productVariant.upsert({
      where: { slug: varSlug },
      update: {
        variantName: "Vay mua xe ô tô",
        minTermMonth: 12,
        maxTermMonth: item.maxTerm,
        status: "active",
      },
      create: {
        slug: varSlug,
        productId: product.id,
        variantName: "Vay mua xe ô tô",
        minTermMonth: 12,
        maxTermMonth: item.maxTerm,
        status: "active",
      },
    });

    const uniqueRateKey = {
      productVariantId: variant.id,
      rateType: "loan",
      termValue: item.term,
      termUnit: "tháng",
      effectiveFrom,
      sourceId: rateSource.id,
    };

    await prisma.interestRateSnapshot.upsert({
      where: { unique_rate_snapshot: uniqueRateKey },
      update: {
        rateValue: item.rate,
        status: "verified",
      },
      create: {
        productVariantId: variant.id,
        rateType: "loan",
        termValue: item.term,
        termUnit: "tháng",
        rateValue: item.rate,
        rateUnit: "percent_per_year",
        effectiveFrom,
        sourceId: rateSource.id,
        status: "verified",
        createdById: adminUser.id,
      },
    });
    console.log(`   ✅ Đã nạp Vay mua xe cho ${bank.shortName}`);
  }

  // ---------------------------------------------------------------------------
  // DATA VAY TIÊU DÙNG (Personal Loan / Tín chấp)
  // Lãi suất tín chấp tiêu dùng
  // ---------------------------------------------------------------------------
  if (vayTieuDungCat) {
    const personalLoanData = [
      { bankSlug: "tpbank", rate: 10.5, term: 12, maxTerm: 60, desc: "Vay tín chấp theo lương, không cần tài sản thế chấp." },
      { bankSlug: "vpbank", rate: 12.0, term: 12, maxTerm: 60, desc: "Hạn mức vay tín chấp tiêu dùng siêu cao lên tới 500 triệu đồng." },
      { bankSlug: "vietcombank", rate: 9.5, term: 12, maxTerm: 60, desc: "Vay tiêu dùng tín chấp dành cho cán bộ công nhân viên chức và người làm công ăn lương." },
      { bankSlug: "vib", rate: 11.5, term: 12, maxTerm: 60, desc: "Đăng ký vay tín chấp online giải ngân nhanh chóng." },
    ];

    console.log("\n🛍️ Bắt đầu nạp sản phẩm Vay Tiêu Dùng Tín Chấp...");
    for (const item of personalLoanData) {
      const bank = bankMap.get(item.bankSlug);
      if (!bank) continue;

      const prodSlug = `vay-tieu-dung-${bank.slug}`;
      const product = await prisma.financialProduct.upsert({
        where: { slug: prodSlug },
        update: {
          name: `Vay tín chấp tiêu dùng - ${bank.shortName ?? bank.name}`,
          status: "active",
          isPublic: true,
        },
        create: {
          slug: prodSlug,
          bankId: bank.id,
          categoryId: vayTieuDungCat.id,
          name: `Vay tín chấp tiêu dùng - ${bank.shortName ?? bank.name}`,
          shortDescription: item.desc,
          longDescription: `${item.desc} Vay tín chấp không tài sản bảo đảm dành cho khách hàng cá nhân. Hồ sơ duyệt dựa trên thu nhập thực tế chuyển khoản của khách hàng.`,
          status: "active",
          isPublic: true,
        },
      });

      const varSlug = `vay-tieu-dung-tin-chap-${bank.slug}`;
      const variant = await prisma.productVariant.upsert({
        where: { slug: varSlug },
        update: {
          variantName: "Vay tiêu dùng tín chấp",
          minTermMonth: 12,
          maxTermMonth: item.maxTerm,
          status: "active",
        },
        create: {
          slug: varSlug,
          productId: product.id,
          variantName: "Vay tiêu dùng tín chấp",
          minTermMonth: 12,
          maxTermMonth: item.maxTerm,
          status: "active",
        },
      });

      const uniqueRateKey = {
        productVariantId: variant.id,
        rateType: "loan",
        termValue: item.term,
        termUnit: "tháng",
        effectiveFrom,
        sourceId: rateSource.id,
      };

      await prisma.interestRateSnapshot.upsert({
        where: { unique_rate_snapshot: uniqueRateKey },
        update: {
          rateValue: item.rate,
          status: "verified",
        },
        create: {
          productVariantId: variant.id,
          rateType: "loan",
          termValue: item.term,
          termUnit: "tháng",
          rateValue: item.rate,
          rateUnit: "percent_per_year",
          effectiveFrom,
          sourceId: rateSource.id,
          status: "verified",
          createdById: adminUser.id,
        },
      });
      console.log(`   ✅ Đã nạp Vay tiêu dùng cho ${bank.shortName}`);
    }
  }

  // ---------------------------------------------------------------------------
  // DATA VAY KINH DOANH (Business Loan)
  // Lãi suất cho vay kinh doanh
  // ---------------------------------------------------------------------------
  if (vayKinhDoanhCat) {
    const businessLoanData = [
      { bankSlug: "vietcombank", rate: 5.4, term: 12, maxTerm: 120, desc: "Gói vay bổ sung vốn kinh doanh ngắn và trung hạn cực kỳ ưu đãi." },
      { bankSlug: "bidv",        rate: 5.5, term: 12, maxTerm: 120, desc: "Đồng hành phát triển cùng hộ kinh doanh cá thể và doanh nghiệp SME." },
      { bankSlug: "agribank",    rate: 5.5, term: 12, maxTerm: 120, desc: "Vay nông nghiệp, sản xuất kinh doanh tại các địa phương." },
      { bankSlug: "vietinbank",  rate: 5.6, term: 12, maxTerm: 120, desc: "Tiếp sức vốn kinh doanh, phương án trả nợ theo chu kỳ nguồn thu." },
      { bankSlug: "techcombank", rate: 5.9, term: 12, maxTerm: 180, desc: "Vay thế chấp phục vụ kinh doanh hạn mức lớn, duyệt hồ sơ nhanh." },
    ];

    console.log("\n📈 Bắt đầu nạp sản phẩm Vay Kinh Doanh...");
    for (const item of businessLoanData) {
      const bank = bankMap.get(item.bankSlug);
      if (!bank) continue;

      const prodSlug = `vay-kinh-doanh-${bank.slug}`;
      const product = await prisma.financialProduct.upsert({
        where: { slug: prodSlug },
        update: {
          name: `Vay sản xuất kinh doanh - ${bank.shortName ?? bank.name}`,
          status: "active",
          isPublic: true,
        },
        create: {
          slug: prodSlug,
          bankId: bank.id,
          categoryId: vayKinhDoanhCat.id,
          name: `Vay sản xuất kinh doanh - ${bank.shortName ?? bank.name}`,
          shortDescription: item.desc,
          longDescription: `${item.desc} Vay thế chấp bổ sung vốn lưu động xoay vòng hoặc đầu tư tài sản cố định phục vụ hoạt động sản xuất kinh doanh của hộ gia đình, cá nhân.`,
          status: "active",
          isPublic: true,
        },
      });

      const varSlug = `vay-kinh-doanh-uu-dai-${bank.slug}`;
      const variant = await prisma.productVariant.upsert({
        where: { slug: varSlug },
        update: {
          variantName: "Vay kinh doanh thế chấp",
          minTermMonth: 12,
          maxTermMonth: item.maxTerm,
          status: "active",
        },
        create: {
          slug: varSlug,
          productId: product.id,
          variantName: "Vay kinh doanh thế chấp",
          minTermMonth: 12,
          maxTermMonth: item.maxTerm,
          status: "active",
        },
      });

      const uniqueRateKey = {
        productVariantId: variant.id,
        rateType: "loan",
        termValue: item.term,
        termUnit: "tháng",
        effectiveFrom,
        sourceId: rateSource.id,
      };

      await prisma.interestRateSnapshot.upsert({
        where: { unique_rate_snapshot: uniqueRateKey },
        update: {
          rateValue: item.rate,
          status: "verified",
        },
        create: {
          productVariantId: variant.id,
          rateType: "loan",
          termValue: item.term,
          termUnit: "tháng",
          rateValue: item.rate,
          rateUnit: "percent_per_year",
          effectiveFrom,
          sourceId: rateSource.id,
          status: "verified",
          createdById: adminUser.id,
        },
      });
      console.log(`   ✅ Đã nạp Vay kinh doanh cho ${bank.shortName}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  const [prodCount, varCount, rateCount] = await Promise.all([
    prisma.financialProduct.count(),
    prisma.productVariant.count(),
    prisma.interestRateSnapshot.count(),
  ]);

  console.log("\n═══════════════════════════════════════");
  console.log("🎉 Nạp dữ liệu lãi suất hoàn thành!");
  console.log(`   Tổng số Financial Products:  ${prodCount}`);
  console.log(`   Tổng số Product Variants:    ${varCount}`);
  console.log(`   Tổng số Interest Rates:      ${rateCount}`);
  console.log("═══════════════════════════════════════");
}

main()
  .catch((e) => {
    console.error("❌ Thất bại:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
