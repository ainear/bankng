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

export type BankerProfile = {
  id: string;
  slug: string;
  title: string | null;
  bio: string | null;
  provinceCode: string | null;
  cityName: string | null;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isActive: boolean;
  bankName: string | null;
  bankSlug: string | null;
  bankLogoUrl: string | null;
  userName: string | null;
  userEmail: string | null;
  avatarUrl: string | null;
  createdAt: Date;
};

export const MOCK_BANKERS: BankerProfile[] = [
  {
    id: "banker-1",
    slug: "nguyen-van-an-vcb",
    title: "Trưởng phòng Khách hàng Cá nhân",
    bio: "Hơn 8 năm kinh nghiệm trong lĩnh vực tài chính ngân hàng. Chuyên hỗ trợ các gói vay mua nhà dự án, vay mua ô tô với thủ tục nhanh gọn, giải ngân trong vòng 24h.",
    provinceCode: "HN",
    cityName: "Hà Nội",
    rating: 4.9,
    reviewCount: 38,
    isVerified: true,
    isActive: true,
    bankName: "Vietcombank",
    bankSlug: "vietcombank",
    bankLogoUrl: "https://cdn.vietqr.io/img/VCB.png",
    userName: "Nguyễn Văn An",
    userEmail: "an.nv@vietcombank.com.vn",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2025-01-15T08:00:00.000Z")
  },
  {
    id: "banker-2",
    slug: "tran-thi-binh-tcb",
    title: "Chuyên viên Tư vấn Tài chính Cao cấp",
    bio: "Chuyên sâu về các sản phẩm vay tín chấp tiêu dùng và thẻ tín dụng hạn mức cao của Techcombank. Tận tâm, hỗ trợ khách hàng 24/7.",
    provinceCode: "HCM",
    cityName: "TP. Hồ Chí Minh",
    rating: 4.8,
    reviewCount: 29,
    isVerified: true,
    isActive: true,
    bankName: "Techcombank",
    bankSlug: "techcombank",
    bankLogoUrl: "https://cdn.vietqr.io/img/TCB.png",
    userName: "Trần Thị Bình",
    userEmail: "binhtt@techcombank.com.vn",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2025-02-20T09:30:00.000Z")
  },
  {
    id: "banker-3",
    slug: "le-hoang-cuong-bidv",
    title: "Phó giám đốc Quan hệ Khách hàng",
    bio: "Tư vấn phương án tài chính tối ưu cho doanh nghiệp vừa và nhỏ, hỗ trợ vay thế chấp nhà đất, vay mua xe với lãi suất ưu đãi nhất hệ thống BIDV.",
    provinceCode: "DN",
    cityName: "Đà Nẵng",
    rating: 4.7,
    reviewCount: 15,
    isVerified: false,
    isActive: true,
    bankName: "BIDV",
    bankSlug: "bidv",
    bankLogoUrl: "https://cdn.vietqr.io/img/BIDV.png",
    userName: "Lê Hoàng Cường",
    userEmail: "cuonglh@bidv.com.vn",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2025-03-05T14:15:00.000Z")
  },
  {
    id: "banker-4",
    slug: "pham-minh-duc-acb",
    title: "Chuyên viên Quan hệ Khách hàng cá nhân",
    bio: "Đồng hành cùng khách hàng trong việc lập kế hoạch tài chính mua nhà, mua xe. Thủ tục ACB đơn giản, nhanh chóng, cam kết phản hồi hồ sơ trong 4 giờ làm việc.",
    provinceCode: "HN",
    cityName: "Hà Nội",
    rating: 4.9,
    reviewCount: 22,
    isVerified: true,
    isActive: true,
    bankName: "ACB",
    bankSlug: "acb",
    bankLogoUrl: "https://cdn.vietqr.io/img/ACB.png",
    userName: "Phạm Minh Đức",
    userEmail: "ducpm@acb.com.vn",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2025-04-10T10:00:00.000Z")
  },
  {
    id: "banker-5",
    slug: "hoang-thi-dung-ctg",
    title: "Trưởng nhóm Khách hàng Ưu tiên",
    bio: "Tư vấn chuyên sâu gói tài chính cá nhân VIP, gửi tiết kiệm lãi suất đặc quyền và các giải pháp vay mua bất động sản cao cấp từ Vietinbank.",
    provinceCode: "HCM",
    cityName: "TP. Hồ Chí Minh",
    rating: 4.8,
    reviewCount: 31,
    isVerified: true,
    isActive: true,
    bankName: "VietinBank",
    bankSlug: "vietinbank",
    bankLogoUrl: "https://cdn.vietqr.io/img/CTG.png",
    userName: "Hoàng Thị Dung",
    userEmail: "dung.ht@vietinbank.vn",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2025-05-12T11:45:00.000Z")
  },
  {
    id: "banker-6",
    slug: "ngo-quoc-dat-mbb",
    title: "Chuyên viên Khách hàng cá nhân",
    bio: "Hỗ trợ vay tiêu dùng không thế chấp, mở thẻ tín dụng MB hiện đại tích hợp nhiều ưu đãi hoàn tiền. Tư vấn nhiệt tình, tận tâm, trách nhiệm.",
    provinceCode: "HP",
    cityName: "Hải Phòng",
    rating: 4.6,
    reviewCount: 10,
    isVerified: false,
    isActive: true,
    bankName: "Military Bank",
    bankSlug: "mb",
    bankLogoUrl: "https://cdn.vietqr.io/img/MBB.png",
    userName: "Ngô Quốc Đạt",
    userEmail: "datnq@mbb.com.vn",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2025-06-01T15:20:00.000Z")
  }
];

export const MOCK_ARTICLES = [
  {
    id: "art-1",
    slug: "kinh-nghiem-vay-mua-nha-lan-dau",
    title: "Kinh nghiệm vay mua nhà lần đầu tránh bẫy lãi suất thả nổi",
    excerpt: "Những điều tối quan trọng cần lưu ý khi đặt bút ký hợp đồng vay vốn mua bất động sản với ngân hàng để không bị áp lực tài chính.",
    content: "<p>Vay mua nhà là một quyết định tài chính lớn kéo dài từ 10 đến 25 năm...</p>",
    categoryName: "Tư vấn Vay",
    categorySlug: "tu-van-vay",
    authorName: "Nguyễn Minh Trí",
    readTimeMin: 5,
    coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=450&fit=crop",
    isFeatured: true,
    createdAt: new Date("2025-05-10T08:00:00.000Z"),
    updatedAt: new Date("2025-05-12T09:00:00.000Z")
  },
  {
    id: "art-2",
    slug: "lai-suat-tiet-kiem-nganh-nao-cao-nhat",
    title: "Cập nhật bảng lãi suất tiết kiệm ngân hàng nào cao nhất hiện nay?",
    excerpt: "Phân tích và so sánh chi tiết biểu lãi suất tiết kiệm các kỳ hạn 1 tháng, 6 tháng và 12 tháng tại các nhóm ngân hàng quốc doanh và tư nhân.",
    content: "<p>Thị trường tiết kiệm những tháng đầu năm 2026 ghi nhận mức biến động nhẹ...</p>",
    categoryName: "Thị trường tài chính",
    categorySlug: "thi-truong-tai-chinh",
    authorName: "Lê Thùy Dương",
    readTimeMin: 4,
    coverImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=450&fit=crop",
    isFeatured: true,
    createdAt: new Date("2025-05-20T10:00:00.000Z"),
    updatedAt: new Date("2025-05-20T10:00:00.000Z")
  },
  {
    id: "art-3",
    slug: "huong-dan-mo-the-tin-dung-online",
    title: "Hướng dẫn mở thẻ tín dụng online nhanh chóng trong 5 phút",
    excerpt: "Quy trình từng bước để đăng ký mở thẻ tín dụng trực tuyến nhận thẻ vật lý tại nhà cùng các ưu đãi hoàn tiền ăn uống, mua sắm hấp dẫn.",
    content: "<p>Mở thẻ tín dụng online hiện nay vô cùng đơn giản nhờ công nghệ eKYC...</p>",
    categoryName: "Mẹo Tiêu Dùng",
    categorySlug: "meo-tieu-dung",
    authorName: "Trần Thế Khoa",
    readTimeMin: 3,
    coverImage: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?w=800&h=450&fit=crop",
    isFeatured: false,
    createdAt: new Date("2025-05-28T14:00:00.000Z"),
    updatedAt: new Date("2025-05-28T14:00:00.000Z")
  }
];

export const MOCK_ARTICLE_CATEGORIES = [
  { id: "ac-1", slug: "tu-van-vay", name: "Tư vấn Vay", sortOrder: 1, articleCount: 1 },
  { id: "ac-2", slug: "thi-truong-tai-chinh", name: "Thị trường tài chính", sortOrder: 2, articleCount: 1 },
  { id: "ac-3", slug: "meo-tieu-dung", name: "Mẹo Tiêu Dùng", sortOrder: 3, articleCount: 1 }
];
