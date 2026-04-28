type FilterableLead = {
  status: string;
  assignedToId: string | null;
  contextType: string;
};

export function filterLeads<T extends FilterableLead>({
  leads,
  status,
  assignee,
  contextType
}: {
  leads: T[];
  status?: string;
  assignee?: string;
  contextType?: string;
}) {
  return leads.filter((lead) => {
    const statusPass = !status || lead.status === status;
    const assigneePass =
      !assignee || (assignee === "unassigned" ? !lead.assignedToId : lead.assignedToId === assignee);
    const contextPass = !contextType || lead.contextType === contextType;

    return statusPass && assigneePass && contextPass;
  });
}
