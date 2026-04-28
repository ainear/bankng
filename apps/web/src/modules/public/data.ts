import { prisma } from "@bankng/db";

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
  return prisma.productCategory.findUnique({
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
