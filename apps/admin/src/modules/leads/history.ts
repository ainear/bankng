export function shouldAppendLeadHistory(input: {
  currentStatus: string;
  nextStatus: string;
  currentAssignedToId: string | null;
  nextAssignedToId: string | null;
}) {
  return (
    input.currentStatus !== input.nextStatus ||
    input.currentAssignedToId !== input.nextAssignedToId
  );
}
