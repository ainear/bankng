export const permissions = {
  submitLead: "lead:submit",
  manageOwnBankerProfile: "banker_profile:manage_own",
  viewAssignedLeads: "lead:view_assigned",
  manageContent: "content:manage",
  manageRates: "rates:manage",
  verifyBankers: "banker:verify",
  manageSettings: "settings:manage"
} as const;

export type Permission = (typeof permissions)[keyof typeof permissions];
