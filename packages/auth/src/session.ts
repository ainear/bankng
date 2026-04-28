import type { Role } from "./roles";

export type AuthenticatedUser = {
  id: string;
  roles: Role[];
};
