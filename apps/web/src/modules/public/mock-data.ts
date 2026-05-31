export const MOCK_CATEGORIES = [
  {
    id: "cat-1",
    name: "Vay mua nhà",
    slug: "vay-mua-nha",
    description: "So sánh gói vay mua nhà lãi suất ưu đãi, hạn mức cao từ các ngân hàng lớn.",
    compareEnabled: true,
    isActive: true,
    _count: { products: 3 }
  },
  {
    id: "cat-2",
    name: "Vay mua xe",
    slug: "vay-mua-xe",
    description: "So sánh lãi suất vay mua ô tô mới/cũ nhanh chóng, phê duyệt dễ dàng.",
    compareEnabled: true,
    isActive: true,
    _count: { products: 2 }
  },
  {
    id: "cat-3",
    name: "Vay tín chấp",
    slug: "vay-tin-chap",
    description: "Vay tiêu dùng không cần tài sản đảm bảo lãi suất hấp dẫn nhất.",
    compareEnabled: true,
    isActive: true,
    _count: { products: 2 }
  },
  {
    id: "cat-4",
    name: "Thẻ tín dụng",
    slug: "the-tin-dung",
    description: "So sánh điều kiện mở thẻ, ưu đãi hoàn tiền và hạn mức thẻ tín dụng.",
    compareEnabled: true,
    isActive: true,
    _count: { products: 1 }
  },
  {
    id: "cat-5",
    name: "Gửi tiết kiệm",
    slug: "tiet-kiem",
    description: "Bảng lãi suất gửi tiết kiệm tại quầy & online cao nhất hiện nay.",
    compareEnabled: true,
    isActive: true,
    _count: { products: 4 }
  }
];

export const MOCK_BANKS = [
  { id: "b1", name: "Vietcombank", shortName: "VCB", slug: "vietcombank", logoUrl: "https://cdn.vietqr.io/img/VCB.png", isActive: true },
  { id: "b2", name: "VietinBank", shortName: "VietinBank", slug: "vietinbank", logoUrl: "https://cdn.vietqr.io/img/CTG.png", isActive: true },
  { id: "b3", name: "BIDV", shortName: "BIDV", slug: "bidv", logoUrl: "https://cdn.vietqr.io/img/BIDV.png", isActive: true },
  { id: "b4", name: "Agribank", shortName: "Agribank", slug: "agribank", logoUrl: "https://cdn.vietqr.io/img/VARB.png", isActive: true },
  { id: "b5", name: "Techcombank", shortName: "Techcombank", slug: "techcombank", logoUrl: "https://cdn.vietqr.io/img/TCB.png", isActive: true },
  { id: "b6", name: "ACB", shortName: "ACB", slug: "acb", logoUrl: "https://cdn.vietqr.io/img/ACB.png", isActive: true },
  { id: "b7", name: "Military Bank", shortName: "MB", slug: "mb", logoUrl: "https://cdn.vietqr.io/img/MBB.png", isActive: true },
  { id: "b8", name: "TPBank", shortName: "TPBank", slug: "tpbank", logoUrl: "https://cdn.vietqr.io/img/TPB.png", isActive: true }
];

export const MOCK_LOAN_PRODUCTS = [
  {
    id: "p1",
    bankName: "BIDV",
    bankLogoUrl: "https://cdn.vietqr.io/img/BIDV.png",
    bankSlug: "bidv",
    productName: "Vay mua nhà gói an cư lạc nghiệp",
    categoryName: "Vay mua nhà",
    categorySlug: "vay-mua-nha",
    rateValue: 5.5,
    termValue: 12,
    minAmount: 500000000,
    maxTermMonth: 240
  },
  {
    id: "p2",
    bankName: "VietinBank",
    bankLogoUrl: "https://cdn.vietqr.io/img/CTG.png",
    bankSlug: "vietinbank",
    productName: "Gói vay mua ô tô CTG Car",
    categoryName: "Vay mua xe",
    categorySlug: "vay-mua-xe",
    rateValue: 6.8,
    termValue: 12,
    minAmount: 200000000,
    maxTermMonth: 96
  },
  {
    id: "p3",
    bankName: "Techcombank",
    bankLogoUrl: "https://cdn.vietqr.io/img/TCB.png",
    bankSlug: "techcombank",
    productName: "Vay mua nhà sở hữu tổ ấm mơ ước",
    categoryName: "Vay mua nhà",
    categorySlug: "vay-mua-nha",
    rateValue: 4.9,
    termValue: 6,
    minAmount: 1000000000,
    maxTermMonth: 300
  },
  {
    id: "p4",
    bankName: "VCB",
    bankLogoUrl: "https://cdn.vietqr.io/img/VCB.png",
    bankSlug: "vietcombank",
    productName: "Vay tiêu dùng tín chấp VCB lương",
    categoryName: "Vay tín chấp",
    categorySlug: "vay-tin-chap",
    rateValue: 8.5,
    termValue: 12,
    minAmount: 50000000,
    maxTermMonth: 60
  }
];

export const MOCK_RATE_MATRIX_ROWS = MOCK_BANKS.map((b, index) => {
  const baseRate = 2.8 + (index * 0.15);
  return {
    bankSlug: b.slug,
    bankName: b.name,
    bankShortName: b.shortName,
    bankLogoUrl: b.logoUrl,
    rates: {
      "1": { rateValue: Number((baseRate).toFixed(2)), status: "verified", effectiveFrom: new Date(), updatedAt: new Date(), reliabilityScore: 95 },
      "3": { rateValue: Number((baseRate + 0.3).toFixed(2)), status: "verified", effectiveFrom: new Date(), updatedAt: new Date(), reliabilityScore: 95 },
      "6": { rateValue: Number((baseRate + 0.9).toFixed(2)), status: "verified", effectiveFrom: new Date(), updatedAt: new Date(), reliabilityScore: 95 },
      "9": { rateValue: Number((baseRate + 1.1).toFixed(2)), status: "verified", effectiveFrom: new Date(), updatedAt: new Date(), reliabilityScore: 95 },
      "12": { rateValue: Number((baseRate + 1.6).toFixed(2)), status: "verified", effectiveFrom: new Date(), updatedAt: new Date(), reliabilityScore: 95 },
      "24": { rateValue: Number((baseRate + 1.8).toFixed(2)), status: "verified", effectiveFrom: new Date(), updatedAt: new Date(), reliabilityScore: 95 },
      "36": { rateValue: Number((baseRate + 1.9).toFixed(2)), status: "verified", effectiveFrom: new Date(), updatedAt: new Date(), reliabilityScore: 95 }
    }
  };
});

export function getMockCompareCategory(slug: string) {
  const cat = MOCK_CATEGORIES.find(c => c.slug === slug);
  if (!cat) return null;

  return {
    ...cat,
    products: MOCK_LOAN_PRODUCTS.filter(p => p.categorySlug === slug).map(p => ({
      id: p.id,
      name: p.productName,
      slug: `${p.id}-detail`,
      shortDescription: `Sản phẩm ${p.productName} với nhiều ưu đãi lãi suất vượt trội, điều kiện thủ tục nhanh gọn.`,
      featuredRank: 1,
      updatedAt: new Date(),
      bank: MOCK_BANKS.find(b => b.slug === p.bankSlug)!,
      variants: [
        {
          id: `${p.id}-v1`,
          variantName: "Gói tiêu chuẩn",
          minAmount: p.minAmount,
          maxTermMonth: p.maxTermMonth,
          minTermMonth: p.termValue,
          status: "active",
          rates: [
            {
              id: `${p.id}-r1`,
              rateValue: p.rateValue,
              rateUnit: "%/năm",
              termValue: p.termValue,
              termUnit: "month",
              effectiveFrom: new Date(),
              updatedAt: new Date(),
              status: "verified",
              source: {
                reliabilityScore: 98
              }
            }
          ]
        }
      ]
    }))
  };
}
