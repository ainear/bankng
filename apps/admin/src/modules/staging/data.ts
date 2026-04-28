import { prisma } from "@bankng/db";

export type StagingJob = Awaited<ReturnType<typeof getStagingJobs>>[number];

export async function getStagingJobs() {
  return prisma.crawlJob.findMany({
    orderBy: { startedAt: "desc" },
    include: {
      _count: { select: { stagingRates: true } }
    }
  });
}

export async function getStagingRates(opts: {
  jobId?: string;
  status?: string;
  bank?: string;
  page?: number;
}) {
  const where: Record<string, unknown> = {};
  if (opts.jobId) where.crawlJobId = opts.jobId;
  if (opts.status) where.status = opts.status;
  if (opts.bank) where.bankSlug = opts.bank;

  const page = opts.page ?? 1;
  const pageSize = 50;

  const [total, items] = await Promise.all([
    prisma.crawlStagingRate.count({ where }),
    prisma.crawlStagingRate.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        crawlJob: { select: { sourceUrl: true, startedAt: true } },
        reviewedBy: { select: { email: true } }
      }
    })
  ]);

  return { total, items, page, pageSize };
}

export async function getStagingStats() {
  const [pending, verified, rejected, total] = await Promise.all([
    prisma.crawlStagingRate.count({ where: { status: "pending" } }),
    prisma.crawlStagingRate.count({ where: { status: "verified" } }),
    prisma.crawlStagingRate.count({ where: { status: "rejected" } }),
    prisma.crawlStagingRate.count()
  ]);

  const jobsRunning = await prisma.crawlJob.count({ where: { status: "running" } });

  return { pending, verified, rejected, total, jobsRunning };
}