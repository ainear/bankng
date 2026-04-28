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
  if (input.submittedPhone !== input.existingPhone) {
    return false;
  }

  if (input.submittedContextSlug !== input.existingContextSlug) {
    return false;
  }

  if (
    input.submittedContextType &&
    input.existingContextType &&
    input.submittedContextType !== input.existingContextType
  ) {
    return false;
  }

  const diffMs = input.submittedAt.getTime() - input.existingCreatedAt.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours <= input.lookbackHours;
}
