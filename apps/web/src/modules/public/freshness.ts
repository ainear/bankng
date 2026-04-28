type PublicFreshnessInput = {
  status: "pending" | "verified" | "rejected" | "expired";
  effectiveFrom: Date;
  updatedAt: Date;
  now: Date;
  reliabilityScore: number | null;
};

export function getPublicFreshness(input: PublicFreshnessInput) {
  if (input.status === "rejected" || input.status === "expired") {
    return {
      label: "Khong kha dung",
      tone: "danger" as const,
      description: "Khong nen dung de ra quyet dinh."
    };
  }

  if (input.status === "pending") {
    return {
      label: "Dang xac minh",
      tone: "warning" as const,
      description: "Du lieu chua duoc xac minh chinh thuc."
    };
  }

  const updatedAtMs = input.updatedAt?.getTime();
  const nowMs = input.now?.getTime();

  if (!Number.isFinite(updatedAtMs) || !Number.isFinite(nowMs)) {
    return {
      label: "Khong ro",
      tone: "warning" as const,
      description: "Khong the xac dinh do tuoi du lieu."
    };
  }

  const ageInDays = Math.floor(
    (nowMs - updatedAtMs) / (1000 * 60 * 60 * 24),
  );

  const score = input.reliabilityScore ?? 0;

  if (ageInDays <= 7 && score >= 70) {
    return {
      label: "Moi cap nhat",
      tone: "success" as const,
      description: "Du lieu moi va nguon co do tin cay tot."
    };
  }

  if (ageInDays <= 30 && score >= 50) {
    return {
      label: "Can xem lai som",
      tone: "warning" as const,
      description: "Du lieu van dung duoc, nhung nen doi chieu them."
    };
  }

  return {
    label: "Da cu",
    tone: "danger" as const,
    description: "Ban nen xac nhan lai voi nguon chinh thuc."
  };
}
