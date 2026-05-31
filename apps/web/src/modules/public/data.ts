import { prisma } from "@bankng/db";
import { MOCK_CATEGORIES, getMockCompareCategory } from "./mock-data";

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
    if (categories.length === 0) return MOCK_CATEGORIES as any;
    return categories;
  } catch (err) {
    console.warn("getCompareCategories offline, falling back to MOCK_CATEGORIES:", err);
    return MOCK_CATEGORIES as any;
  }
}

export async function getPublicBankSlugs() {
  const banks = await prisma.bank.findMany({
    where: { isActive: true },
    select: { slug: true }
  });
  return banks.map((bank) => ({ slug: bank.slug }));
}

export async function getPublicProductSlugs() {
  const products = await prisma.financialProduct.findMany({
    where: { isPublic: true, status: "active" },
    select: { slug: true }
  });
  return products.map((product) => ({ slug: product.slug }));
}


export async function getPublicHomeData() {
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

  return { categories, products };
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
    if (!category) return getMockCompareCategory(slug) as any;
    return category;
  } catch (err) {
    console.warn(`getCompareCategory(${slug}) offline, falling back to mock:`, err);
    return getMockCompareCategory(slug) as any;
  }
}

export async function getPublicProduct(slug: string) {
  return prisma.financialProduct.findFirst({
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
}

export async function getPublicBank(slug: string) {
  return prisma.bank.findFirst({
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
}
