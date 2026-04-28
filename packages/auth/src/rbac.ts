import type { Permission } from "./permissions";
import { permissions } from "./permissions";
import { roles, type Role } from "./roles";
import type { AuthenticatedUser } from "./session";

const rolePermissions: Record<Role, Permission[]> = {
  [roles.visitor]: [permissions.submitLead],
  [roles.user]: [permissions.submitLead],
  [roles.banker]: [
    permissions.submitLead,
    permissions.manageOwnBankerProfile,
    permissions.viewAssignedLeads
  ],
  [roles.editor]: [permissions.manageContent],
  [roles.opsAdmin]: [
    permissions.manageRates,
    permissions.verifyBankers,
    permissions.manageContent,
    permissions.viewAssignedLeads
  ],
  [roles.superAdmin]: Object.values(permissions)
};

export function hasPermission(user: AuthenticatedUser | null, permission: Permission) {
  if (!user) {
    return false;
  }

  return user.roles.some((role) => rolePermissions[role]?.includes(permission));
}

export function requirePermission(user: AuthenticatedUser | null, permission: Permission) {
  if (!hasPermission(user, permission)) {
    throw new Error(`Missing permission: ${permission}`);
  }
}
