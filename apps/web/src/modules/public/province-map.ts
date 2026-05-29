export interface ProvinceInfo {
  code: string;
  name: string;
  slug: string;
}

export const PROVINCES: ProvinceInfo[] = [
  { code: "HN", name: "Hà Nội", slug: "ha-noi" },
  { code: "HCM", name: "Hồ Chí Minh", slug: "ho-chi-minh" },
  { code: "DN", name: "Đà Nẵng", slug: "da-nang" },
  { code: "HP", name: "Hải Phòng", slug: "hai-phong" },
  { code: "CT", name: "Cần Thơ", slug: "can-tho" },
  { code: "BD", name: "Bình Dương", slug: "binh-duong" },
  { code: "ĐN", name: "Đồng Nai", slug: "dong-nai" },
  { code: "KH", name: "Khánh Hòa", slug: "khanh-hoa" },
  { code: "LA", name: "Long An", slug: "long-an" },
  { code: "TG", name: "Tiền Giang", slug: "tien-giang" },
  { code: "VT", name: "Bà Rịa - Vũng Tàu", slug: "ba-ria-vung-tau" },
  { code: "BN", name: "Bắc Ninh", slug: "bac-ninh" },
  { code: "HD", name: "Hải Dương", slug: "hai-duong" },
  { code: "QN", name: "Quảng Ninh", slug: "quang-ninh" },
  { code: "TH", name: "Thanh Hóa", slug: "thanh-hoa" },
  { code: "NA", name: "Nghệ An", slug: "nghe-an" },
  { code: "Huế", name: "Thừa Thiên Huế", slug: "thua-thien-hue" },
  { code: "QNam", name: "Quảng Nam", slug: "quang-nam" },
  { code: "ĐL", name: "Đắk Lắk", slug: "dak-lak" },
  { code: "LD", name: "Lâm Đồng", slug: "lam-dong" },
  { code: "AG", name: "An Giang", slug: "an-giang" },
  { code: "CM", name: "Cà Mau", slug: "ca-mau" },
  { code: "KG", name: "Kiên Giang", slug: "kien-giang" },
  { code: "VL", name: "Vĩnh Long", slug: "vinh-long" },
  { code: "BT", name: "Bến Tre", slug: "ben-tre" },
  { code: "TV", name: "Trà Vinh", slug: "tra-vinh" },
  { code: "ST", name: "Sóc Trăng", slug: "soc-trang" },
  { code: "DT", name: "Đồng Tháp", slug: "dong-thap" },
  { code: "HGiang", name: "Hậu Giang", slug: "hau-giang" },
  { code: "BL", name: "Bạc Liêu", slug: "bac-lieu" },
  { code: "TNguy", name: "Thái Nguyên", slug: "thai-nguyen" },
  { code: "VP", name: "Vĩnh Phúc", slug: "vinh-phuc" },
  { code: "BG", name: "Bắc Giang", slug: "bac-giang" },
  { code: "PT", name: "Phú Thọ", slug: "phu-tho" },
  { code: "NB", name: "Ninh Bình", slug: "ninh-binh" },
  { code: "TB", name: "Thái Bình", slug: "thai-binh" },
  { code: "ND", name: "Nam Định", slug: "nam-dinh" },
  { code: "HY", name: "Hưng Yên", slug: "hung-yen" },
  { code: "HB", name: "Hòa Bình", slug: "hoa-binh" },
  { code: "LS", name: "Lạng Sơn", slug: "lang-son" },
  { code: "LC", name: "Lào Cai", slug: "lao-cai" },
  { code: "DB", name: "Điện Biên", slug: "dien-bien" },
  { code: "SL", name: "Sơn La", slug: "son-la" },
  { code: "CB", name: "Cao Bằng", slug: "cao-bang" },
  { code: "HG", name: "Hà Giang", slug: "ha-giang" },
  { code: "BK", name: "Bắc Kạn", slug: "bac-kan" },
  { code: "TQ", name: "Tuyên Quang", slug: "tuyen-quang" },
  { code: "YB", name: "Yên Bái", slug: "yen-bai" },
  { code: "LChau", name: "Lai Châu", slug: "lai-chau" },
  { code: "QB", name: "Quảng Bình", slug: "quang-binh" },
  { code: "QT", name: "Quảng Trị", slug: "quang-tri" },
  { code: "BĐ", name: "Bình Định", slug: "binh-dinh" },
  { code: "PY", name: "Phú Yên", slug: "phu-yen" },
  { code: "GL", name: "Gia Lai", slug: "gia-lai" },
  { code: "KT", name: "Kon Tum", slug: "kon-tum" },
  { code: "ĐNong", name: "Đắk Nông", slug: "dak-nong" },
  { code: "BP", name: "Bình Phước", slug: "binh-phuoc" },
  { code: "T Ninh", name: "Tây Ninh", slug: "tay-ninh" },
  { code: "NT", name: "Ninh Thuận", slug: "ninh-thuan" },
  { code: "BT huan", name: "Bình Thuận", slug: "binh-thuan" },
];

export function getProvinceBySlug(slug: string): ProvinceInfo | undefined {
  return PROVINCES.find((p) => p.slug === slug);
}

export function getProvinceByCode(code: string): ProvinceInfo | undefined {
  return PROVINCES.find((p) => p.code === code);
}
