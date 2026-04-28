import type { Prisma } from "@bankng/db";
import { Card } from "@bankng/ui";
import { getPublicFreshness } from "../freshness";
import { PublicBadge } from "./public-badge";

type RateCardProps = {
  rate: Prisma.InterestRateSnapshotGetPayload<{
    include: {
      source: true;
      branch: true;
      verifications: {
        include: {
          verifier: {
            select: { email: true };
          };
        };
      };
    };
  }>;
};

export function RateCard({ rate }: RateCardProps) {
  const freshness = getPublicFreshness({
    status: rate.status,
    effectiveFrom: rate.effectiveFrom,
    updatedAt: rate.updatedAt,
    now: new Date(),
    reliabilityScore: rate.source.reliabilityScore
  });

  const latestVerification = rate.verifications[0];

  return (
    <Card title={`${rate.rateType} - ${rate.rateValue.toString()} ${rate.rateUnit}`}>
      <div className="flex flex-wrap gap-2">
        <PublicBadge tone={freshness.tone}>{freshness.label}</PublicBadge>
        <PublicBadge tone={rate.status === "verified" ? "success" : "warning"}>
          {rate.status}
        </PublicBadge>
      </div>
      <div className="mt-3 grid gap-1 text-sm text-[var(--bankng-text-secondary)]">
        <div>Source: {rate.source.sourceName}</div>
        <div>Reliability: {rate.source.reliabilityScore}</div>
        <div>Effective from: {rate.effectiveFrom.toISOString().slice(0, 10)}</div>
        <div>Branch: {rate.branch?.branchName ?? "No branch"}</div>
        {latestVerification ? (
          <div>
            Last review: {latestVerification.verdict} by {latestVerification.verifier.email}
          </div>
        ) : null}
      </div>
      <p className="mt-3 text-sm">{freshness.description}</p>
    </Card>
  );
}
