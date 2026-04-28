export const roles = {
  visitor: "visitor",
  user: "user",
  banker: "banker",
  editor: "editor",
  opsAdmin: "ops_admin",
  superAdmin: "super_admin"
} as const;

export type Role = (typeof roles)[keyof typeof roles];
