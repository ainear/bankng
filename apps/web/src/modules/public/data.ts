import { prisma } from "@bankng/db";
import { MOCK_CATEGORIES, MOCK_BANKS, MOCK_LOAN_PRODUCTS, getMockCompareCategory } from "./mock-data";

export let isOffline = false;

export async function getCompareCategories() {
  try {
    const categories = await prisma.productCategory.findMany({
      where: {
        isActive: true,
        compareEnabled: true
      },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            products: {
              where: { isPublic: true, status: "active" }
            }
          }
        }
      }
    });
    isOffline = false;
    if (categories.length === 0) return MOCK_CATEGORIES as any;
    return categories;
  } catch (err) {
    console.warn("getCompareCategories offline, falling back to MOCK_CATEGORIES:", err);
    isOffline = true;
    return MOCK_CATEGORIES as any;
  }
}

export async function getPublicBankSlugs() {
  try {
    const banks = await prisma.bank.findMany({
      where: { isActive: true },
      select: { slug: true }
    });
    isOffline = false;
    return banks.map((bank) => ({ slug: bank.slug }));
  } catch (err) {
    console.warn("getPublicBankSlugs offline, falling back to MOCK_BANKS:", err);
    isOffline = true;
    return MOCK_BANKS.map((b) => ({ slug: b.slug }));
  }
}

export async function getPublicProductSlugs() {
  try {
    const products = await prisma.financialProduct.findMany({
      where: { isPublic: true, status: "active" },
      select: { slug: true }
    });
    isOffline = false;
    return products.map((product) => ({ slug: product.slug }));
  } catch (err) {
    console.warn("getPublicProductSlugs offline, falling back to MOCK_LOAN_PRODUCTS:", err);
    isOffline = true;
    return MOCK_LOAN_PRODUCTS.map((p) => ({ slug: `${p.id}-detail` }));
  }
}

export async function getPublicHomeData() {
  try {
    const [categories, products] = await Promise.all([
      prisma.productCategory.findMany({
        where: {
          isActive: true,
          compareEnabled: true
        },
        orderBy: { name: "asc" }
      }),
      prisma.financialProduct.findMany({
        where: {
          isPublic: true,
          status: "active"
        },
        orderBy: { updatedAt: "desc" },
        include: {
          bank: true,
          category: true,
          variants: {
            include: {
              rates: {
                where: {
                  status: {
                    in: ["pending", "verified"]
                  }
                },
                orderBy: { effectiveFrom: "desc" },
                include: {
                  source: true
                }
              }
            }
          }
        }
      })
    ]);

    isOffline = false;
    return { categories, products };
  } catch (err) {
    console.warn("getPublicHomeData offline, falling back to mock:", err);
    isOffline = true;
    return {
      categories: MOCK_CATEGORIES as any,
      products: MOCK_LOAN_PRODUCTS.map(p => ({
        id: p.id,
        name: p.productName,
        slug: `${p.id}-detail`,
        status: "active",
        isPublic: true,
        updatedAt: new Date(),
        bank: MOCK_BANKS.find(b => b.slug === p.bankSlug) || { name: p.bankName, logoUrl: p.bankLogoUrl, slug: p.bankSlug },
        category: MOCK_CATEGORIES.find(c => c.name === p.categoryName) || { name: p.categoryName, slug: p.categorySlug },
        variants: [
          {
            id: `${p.id}-v1`,
            variantName: "Mặc định",
            minAmount: p.minAmount,
            maxTermMonth: p.maxTermMonth,
            status: "active",
            rates: [
              {
                id: `${p.id}-r1`,
                rateValue: p.rateValue,
                termValue: p.termValue,
                effectiveFrom: new Date(),
                status: "verified",
                source: { reliabilityScore: 95 }
              }
            ]
          }
        ]
      })) as any
    };
  }
}

export async function getCompareCategory(slug: string) {
  try {
    const category = await prisma.productCategory.findUnique({
      where: { slug },
      include: {
        products: {
          where: {
            isPublic: true,
            status: "active"
          },
          orderBy: [{ featuredRank: "asc" }, { updatedAt: "desc" }],
          include: {
            bank: true,
            variants: {
              where: {
                status: "active"
              },
              include: {
                rates: {
                  where: {
                    status: {
                      in: ["pending", "verified"]
                    }
                  },
                  orderBy: { effectiveFrom: "desc" },
                  include: {
                    source: true
                  }
                }
              }
            }
          }
        }
      }
    });
    isOffline = false;
    if (!category) return getMockCompareCategory(slug) as any;
    return category;
  } catch (err) {
    console.warn(`getCompareCategory(${slug}) offline, falling back to mock:`, err);
    isOffline = true;
    return getMockCompareCategory(slug) as any;
  }
}

export async function getPublicProduct(slug: string) {
  try {
    const product = await prisma.financialProduct.findFirst({
      where: {
        slug,
        isPublic: true,
        status: "active"
      },
      include: {
        bank: {
          include: {
            branches: {
              where: { isActive: true },
              orderBy: { branchName: "asc" }
            }
          }
        },
        category: true,
        variants: {
          where: {
            status: "active"
          },
          include: {
            rates: {
              orderBy: { effectiveFrom: "desc" },
              include: {
                source: true,
                branch: true,
                verifications: {
                  orderBy: { createdAt: "desc" },
                  take: 1,
                  include: {
                    verifier: {
                      select: { email: true }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    isOffline = false;
    return product;
  } catch (err) {
    console.warn(`getPublicProduct(${slug}) offline, falling back to mock product:`, err);
    isOffline = true;

    const found = MOCK_LOAN_PRODUCTS.find(p => p.id === slug || `${p.id}-detail` === slug);
    if (!found) return null;

    return {
      id: found.id,
      name: found.productName,
      slug: `${found.id}-detail`,
      description: `Sản phẩm ${found.productName} với nhiều ưu đãi lãi suất vượt trội, điều kiện thủ tục nhanh gọn.`,
      bank: {
        ...(MOCK_BANKS.find(b => b.slug === found.bankSlug) || { name: found.bankName, logoUrl: found.bankLogoUrl, slug: found.bankSlug }),
        branches: [
          { id: `br-1`, branchName: "Trụ sở chính", address: "Hà Nội", isActive: true }
        ]
      },
      category: MOCK_CATEGORIES.find(c => c.slug === found.categorySlug) || null,
      variants: [
        {
          id: `${found.id}-v1`,
          variantName: "Gói tiêu chuẩn",
          minAmount: found.minAmount,
          maxTermMonth: found.maxTermMonth,
          minTermMonth: found.termValue,
          status: "active",
          rates: [
            {
              id: `${found.id}-r1`,
              rateValue: found.rateValue,
              rateUnit: "%/năm",
              termValue: found.termValue,
              termUnit: "month",
              effectiveFrom: new Date(),
              updatedAt: new Date(),
              status: "verified",
              source: { reliabilityScore: 98 },
              branch: null,
              verifications: []
            }
          ]
        }
      ]
    } as any;
  }
}

export async function getPublicBank(slug: string) {
  try {
    const bank = await prisma.bank.findFirst({
      where: {
        slug,
        isActive: true
      },
      include: {
        branches: {
          where: { isActive: true },
          orderBy: { branchName: "asc" }
        },
        products: {
          where: {
            isPublic: true,
            status: "active"
          },
          include: {
            category: true,
            variants: {
              where: { status: "active" },
              include: {
                rates: {
                  where: {
                    status: {
                      in: ["pending", "verified"]
                    }
                  },
                  orderBy: { effectiveFrom: "desc" },
                  include: {
                    source: true
                  }
                }
              }
            }
          },
          orderBy: { updatedAt: "desc" }
        }
      }
    });
    isOffline = false;
    return bank;
  } catch (err) {
    console.warn(`getPublicBank(${slug}) offline, falling back to mock bank:`, err);
    isOffline = true;

    const bank = MOCK_BANKS.find(b => b.slug === slug);
    if (!bank) return null;

    return {
      ...bank,
      branches: [
        { id: `br-${bank.id}-1`, branchName: `Chi nhánh ${bank.name} Hà Nội`, address: "123 Đường Láng, Hà Nội", isActive: true },
        { id: `br-${bank.id}-2`, branchName: `Chi nhánh ${bank.name} TP. HCM`, address: "456 Nguyễn Thị Minh Khai, Quận 1, TP. HCM", isActive: true }
      ],
      products: MOCK_LOAN_PRODUCTS.filter(p => p.bankSlug === slug).map(p => ({
        id: p.id,
        name: p.productName,
        slug: `${p.id}-detail`,
        category: MOCK_CATEGORIES.find(c => c.slug === p.categorySlug) || null,
        variants: [
          {
            id: `${p.id}-v1`,
            status: "active",
            rates: [
              {
                id: `${p.id}-r1`,
                rateValue: p.rateValue,
                termValue: p.termValue,
                effectiveFrom: new Date(),
                status: "verified",
                source: { reliabilityScore: 95 }
              }
            ]
          }
        ]
      }))
    } as any;
  }
}
