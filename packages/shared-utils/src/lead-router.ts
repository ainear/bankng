/* eslint-disable @typescript-eslint/no-explicit-any */
export function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  
  // If it starts with 84, replace with 0
  if (cleaned.startsWith("84") && cleaned.length > 10) {
    return "0" + cleaned.slice(2);
  }
  
  return cleaned;
}

export async function routeLeadToBanker(
  leadData: { provinceCode: string | null; contextType: string },
  prisma: any
): Promise<string | null> {
  if (!leadData.provinceCode) return null;

  try {
    // Find all active & verified bankers
    const bankers = await prisma.banker.findMany({
      where: {
        isVerified: true,
        isActive: true,
        provinceCode: leadData.provinceCode,
      },
      select: {
        id: true,
        userId: true,
        specialties: true,
      },
    });

    // Filter bankers who have the contextType in their specialties
    const qualifiedBankers = bankers.filter((banker: any) => {
      if (!banker.specialties) return false;
      const specs = banker.specialties.split(",");
      return specs.includes(leadData.contextType);
    });

    if (qualifiedBankers.length === 0) {
      return null;
    }

    // Get active/pending leads count for each qualified banker user to implement Round-Robin
    const bankerUserIds = qualifiedBankers.map((b: any) => b.userId);
    
    // Count active leads (new or contacted) assigned to each banker
    const leadsCounts = await Promise.all(
      bankerUserIds.map(async (userId: string) => {
        const count = await prisma.lead.count({
          where: {
            assignedToId: userId,
            status: { in: ["new", "contacted"] },
          },
        });
        return { userId, count };
      })
    );

    // Find the minimum count
    let minCount = Infinity;
    let selectedUserId: string | null = null;

    // Shuffle leadsCounts for random tie-breaker
    const shuffledCounts = leadsCounts.sort(() => Math.random() - 0.5);

    for (const item of shuffledCounts) {
      if (item.count < minCount) {
        minCount = item.count;
        selectedUserId = item.userId;
      }
    }

    return selectedUserId;
  } catch (error) {
    console.error("Error in routeLeadToBanker:", error);
    return null;
  }
}
