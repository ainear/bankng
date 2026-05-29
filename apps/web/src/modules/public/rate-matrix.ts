import { prisma } from "@bankng/db";

export type RateMatrixRow = {
  bankSlug: string;
  bankName: string;
  bankShortName: string | null;
  bankLogoUrl: string | null;
  rates: {
    [term: string]: {
      rateValue: number;
      status: string;
      effectiveFrom: Date;
      updatedAt: Date;
      reliabilityScore: number;
    } | null;
  };
};

export type RateMatrixData = {
  rows: RateMatrixRow[];
  terms: string[];
  lastUpdated: Date;
};

const SAVINGS_TERMS = ["1", "3", "6", "9", "12", "24", "36"];

export async function getRateMatrix(opts?: {
  bankType?: "all" | "big4" | "private" | "foreign";
  rateType?: "online" | "counter";
}) {
  // Fetch all verified savings rates with bank info
  const rates = await prisma.interestRateSnapshot.findMany({
    where: {
      rateType: "deposit",
      status: "verified",
    },
    orderBy: { effectiveFrom: "desc" },
    include: {
      productVariant: {
        include: {
          product: {
            include: {
              bank: true,
            },
          },
        },
      },
      source: true,
    },
  });

  // Group by bank and term, pick the latest/best rate per bank-term
  const bankRatesMap = new Map<
    string,
    {
      bankSlug: string;
      bankName: string;
      bankShortName: string | null;
      bankLogoUrl: string | null;
      rates: Record<
        string,
        {
          rateValue: number;
          status: string;
          effectiveFrom: Date;
          updatedAt: Date;
          reliabilityScore: number;
        }
      >;
    }
  >();

  for (const rate of rates) {
    const bank = rate.productVariant.product.bank;
    const termKey = rate.termValue?.toString() ?? "";

    // Filter by bank type
    if (opts?.bankType === "big4" && !isBig4Bank(bank.slug)) continue;
    if (opts?.bankType === "private" && !isPrivateBank(bank.slug)) continue;
    if (opts?.bankType === "foreign" && !isForeignBank(bank.slug)) continue;

    if (!bankRatesMap.has(bank.slug)) {
      bankRatesMap.set(bank.slug, {
        bankSlug: bank.slug,
        bankName: bank.name,
        bankShortName: bank.shortName,
        bankLogoUrl: bank.logoUrl,
        rates: {},
      });
    }

    const entry = bankRatesMap.get(bank.slug)!;

    // For each term, keep the highest rate
    if (termKey && SAVINGS_TERMS.includes(termKey)) {
      const existing = entry.rates[termKey];
      if (
        !existing ||
        Number(rate.rateValue) > existing.rateValue
      ) {
        entry.rates[termKey] = {
          rateValue: Number(rate.rateValue),
          status: rate.status,
          effectiveFrom: rate.effectiveFrom,
          updatedAt: rate.updatedAt,
          reliabilityScore: rate.source?.reliabilityScore ?? 0,
        };
      }
    }
  }

  const rows = Array.from(bankRatesMap.values()).sort((a, b) =>
    a.bankName.localeCompare(b.bankName)
  );

  return {
    rows,
    terms: SAVINGS_TERMS,
    lastUpdated: new Date(),
  };
}

function isBig4Bank(slug: string) {
  return ["vietcombank", "vietinbank", "bidv", "agribank"].includes(slug);
}

function isForeignBank(slug: string) {
  const foreignSlugs = [
    "shinhanbank", "standardchartered", "citibank", "hsbc",
    "publicbank", "cimb", "uob", "hongleong", "woori",
  ];
  return foreignSlugs.includes(slug);
}

function isPrivateBank(slug: string) {
  return !isBig4Bank(slug) && !isForeignBank(slug);
}

export { SAVINGS_TERMS };
