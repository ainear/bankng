type FreshnessInput = {
  status: "pending" | "verified" | "rejected" | "expired";
  effectiveFrom: Date;
  updatedAt: Date;
  now: Date;
  reliabilityScore: number;
};

export function getFreshnessIndicator(input: FreshnessInput) {
  if (input.status === "rejected" || input.status === "expired") {
    return {
      label: "Blocked",
      tone: "danger" as const,
      description: "Khong nen hien thi nhu du lieu dang tin cay."
    };
  }

  if (input.status === "pending") {
    return {
      label: "Pending",
      tone: "warning" as const,
      description: "Dang cho xac minh rate."
    };
  }

  const ageInDays = Math.floor(
    (input.now.getTime() - input.updatedAt.getTime()) / (1000 * 60 * 60 * 24),
  );
  const effectiveLagDays = Math.floor(
    (input.now.getTime() - input.effectiveFrom.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (ageInDays <= 7 && effectiveLagDays <= 7 && input.reliabilityScore >= 70) {
    return {
      label: "Fresh",
      tone: "success" as const,
      description: "Moi cap nhat va nguon co do tin cay tot."
    };
  }

  if (ageInDays <= 45 && input.reliabilityScore >= 50) {
    return {
      label: "Aging",
      tone: "warning" as const,
      description: "Can xem lai som de tranh stale data."
    };
  }

  return {
    label: "Stale",
    tone: "danger" as const,
    description: "Qua cu hoac nguon tin cay thap."
  };
}
