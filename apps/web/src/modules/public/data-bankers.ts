import { prisma } from "@bankng/db";

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

export async function getBankers(opts?: {
  bankSlug?: string;
  province?: string;
  search?: string;
  limit?: number;
}): Promise<BankerProfile[]> {
  const where: Record<string, unknown> = {
    isActive: true,
  };

  if (opts?.bankSlug) {
    where.bank = { slug: opts.bankSlug };
  }

  if (opts?.province) {
    where.provinceCode = opts.province;
  }

  if (opts?.search) {
    where.OR = [
      { user: { profile: { fullName: { contains: opts.search, mode: "insensitive" } } } },
      { bio: { contains: opts.search, mode: "insensitive" } },
      { title: { contains: opts.search, mode: "insensitive" } },
    ];
  }

  const bankers = await prisma.banker.findMany({
    where,
    orderBy: [
      { isVerified: "desc" },
      { rating: "desc" },
      { reviewCount: "desc" },
    ],
    take: opts?.limit,
    include: {
      user: {
        include: {
          profile: true,
        },
      },
      bank: {
        select: {
          name: true,
          slug: true,
          logoUrl: true,
        },
      },
    },
  });

  return bankers.map((b) => ({
    id: b.id,
    slug: b.slug,
    title: b.title,
    bio: b.bio,
    provinceCode: b.provinceCode,
    cityName: b.cityName,
    rating: Number(b.rating),
    reviewCount: b.reviewCount,
    isVerified: b.isVerified,
    isActive: b.isActive,
    bankName: b.bank?.name ?? null,
    bankSlug: b.bank?.slug ?? null,
    bankLogoUrl: b.bank?.logoUrl ?? null,
    userName: b.user?.profile?.fullName ?? null,
    userEmail: b.user?.email ?? null,
    avatarUrl: b.user?.profile?.avatarUrl ?? null,
    createdAt: b.createdAt,
  }));
}

export async function getBanker(slug: string): Promise<BankerProfile | null> {
  const banker = await prisma.banker.findUnique({
    where: { slug, isActive: true },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
      bank: {
        select: {
          name: true,
          slug: true,
          logoUrl: true,
        },
      },
    },
  });

  if (!banker) return null;

  return {
    id: banker.id,
    slug: banker.slug,
    title: banker.title,
    bio: banker.bio,
    provinceCode: banker.provinceCode,
    cityName: banker.cityName,
    rating: Number(banker.rating),
    reviewCount: banker.reviewCount,
    isVerified: banker.isVerified,
    isActive: banker.isActive,
    bankName: banker.bank?.name ?? null,
    bankSlug: banker.bank?.slug ?? null,
    bankLogoUrl: banker.bank?.logoUrl ?? null,
    userName: banker.user?.profile?.fullName ?? null,
    userEmail: banker.user?.email ?? null,
    avatarUrl: banker.user?.profile?.avatarUrl ?? null,
    createdAt: banker.createdAt,
  };
}

export async function getBankerStats() {
  const [bankerCount, bankCount, provinceCount] = await Promise.all([
    prisma.banker.count({ where: { isActive: true } }),
    prisma.banker.groupBy({
      by: ["bankId"],
      where: { isActive: true, bankId: { not: null } },
    }),
    prisma.banker.groupBy({
      by: ["provinceCode"],
      where: { isActive: true, provinceCode: { not: null } },
    }),
  ]);

  return {
    bankerCount,
    bankCount: bankCount.length,
    provinceCount: provinceCount.length,
  };
}
