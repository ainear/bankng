import { prisma } from "@bankng/db";
import { MOCK_BANKERS, BankerProfile } from "./mock-data";

export type { BankerProfile };

export let isOffline = false;

export async function getBankers(opts?: {
  bankSlug?: string;
  province?: string;
  search?: string;
  limit?: number;
}): Promise<BankerProfile[]> {
  try {
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

    isOffline = false;

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
  } catch (err) {
    console.warn("getBankers offline, falling back to MOCK_BANKERS:", err);
    isOffline = true;

    let filtered = [...MOCK_BANKERS];
    if (opts?.bankSlug) {
      filtered = filtered.filter(b => b.bankSlug === opts.bankSlug);
    }
    if (opts?.province) {
      filtered = filtered.filter(b => b.provinceCode === opts.province);
    }
    if (opts?.search) {
      const s = opts.search.toLowerCase();
      filtered = filtered.filter(b => 
        (b.userName && b.userName.toLowerCase().includes(s)) ||
        (b.bio && b.bio.toLowerCase().includes(s)) ||
        (b.title && b.title.toLowerCase().includes(s))
      );
    }
    if (opts?.limit) {
      filtered = filtered.slice(0, opts.limit);
    }
    return filtered;
  }
}

export async function getBanker(slug: string): Promise<BankerProfile | null> {
  try {
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

    isOffline = false;

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
  } catch (err) {
    console.warn(`getBanker(${slug}) offline, falling back to MOCK_BANKERS:`, err);
    isOffline = true;
    return MOCK_BANKERS.find(b => b.slug === slug) ?? null;
  }
}

export async function getBankerStats() {
  try {
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

    isOffline = false;

    return {
      bankerCount,
      bankCount: bankCount.length,
      provinceCount: provinceCount.length,
    };
  } catch (err) {
    console.warn("getBankerStats offline, calculating stats from MOCK_BANKERS:", err);
    isOffline = true;
    
    const uniqueBanks = new Set(MOCK_BANKERS.map(b => b.bankSlug).filter(Boolean));
    const uniqueProvinces = new Set(MOCK_BANKERS.map(b => b.provinceCode).filter(Boolean));
    
    return {
      bankerCount: MOCK_BANKERS.length,
      bankCount: uniqueBanks.size,
      provinceCount: uniqueProvinces.size,
    };
  }
}
