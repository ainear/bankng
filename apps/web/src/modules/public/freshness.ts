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
      label: "Không khả dụng",
      tone: "danger" as const,
      description: "Không nên dùng để ra quyết định."
    };
  }

  if (input.status === "pending") {
    return {
      label: "Đang xác minh",
      tone: "warning" as const,
      description: "Dữ liệu chưa được xác minh chính thức."
    };
  }

  const updatedAtMs = input.updatedAt?.getTime();
  const nowMs = input.now?.getTime();

  if (!Number.isFinite(updatedAtMs) || !Number.isFinite(nowMs)) {
    return {
      label: "Không rõ",
      tone: "warning" as const,
      description: "Không thể xác định độ tuổi dữ liệu."
    };
  }

  const ageInDays = Math.floor(
    (nowMs - updatedAtMs) / (1000 * 60 * 60 * 24),
  );

  const score = input.reliabilityScore ?? 0;

  if (ageInDays <= 7 && score >= 70) {
    return {
      label: "Mới cập nhật",
      tone: "success" as const,
      description: "Dữ liệu mới và nguồn có độ tin cậy tốt."
    };
  }

  if (ageInDays <= 30 && score >= 50) {
    return {
      label: "Cần xem lại sớm",
      tone: "warning" as const,
      description: "Dữ liệu vẫn dùng được, nhưng nên đối chiếu thêm."
    };
  }

  return {
    label: "Đã cũ",
    tone: "danger" as const,
    description: "Bạn nên xác nhận lại với nguồn chính thức."
  };
}
