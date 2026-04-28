export function isDuplicateLead(input: {
  submittedPhone: string;
  existingPhone: string;
  submittedContextSlug: string;
  existingContextSlug: string;
  submittedContextType?: string;
  existingContextType?: string;
  submittedAt: Date;
  existingCreatedAt: Date;
  lookbackHours: number;
}) {
  const subType = input.submittedContextType ?? "";
  const exType = input.existingContextType ?? "";

  if (input.submittedPhone !== input.existingPhone) {
    return false;
  }

  if (input.submittedContextSlug !== input.existingContextSlug) {
    return false;
  }

  if (subType && exType && subType !== exType) {
    return false;
  }

  const diffMs = input.submittedAt.getTime() - input.existingCreatedAt.getTime();

  if (diffMs < 0) {
    return false;
  }

  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours <= input.lookbackHours;
}
