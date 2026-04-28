import { describe, expect, it } from "vitest";
import { hasPermission, permissions, requirePermission, roles } from "./index";

describe("RBAC baseline", () => {
  it("allows editors to manage content but not rates", () => {
    const editor = { id: "user-editor", roles: [roles.editor] };

    expect(hasPermission(editor, permissions.manageContent)).toBe(true);
    expect(hasPermission(editor, permissions.manageRates)).toBe(false);
  });

  it("allows ops admins to manage rates and verify bankers", () => {
    const opsAdmin = { id: "user-ops", roles: [roles.opsAdmin] };

    expect(hasPermission(opsAdmin, permissions.manageRates)).toBe(true);
    expect(hasPermission(opsAdmin, permissions.verifyBankers)).toBe(true);
  });

  it("prevents bankers from managing admin resources", () => {
    const banker = { id: "user-banker", roles: [roles.banker] };

    expect(hasPermission(banker, permissions.manageRates)).toBe(false);
    expect(hasPermission(banker, permissions.manageOwnBankerProfile)).toBe(true);
  });

  it("allows super admins to do everything", () => {
    const superAdmin = { id: "user-super", roles: [roles.superAdmin] };

    expect(Object.values(permissions).every((permission) => hasPermission(superAdmin, permission))).toBe(
      true,
    );
  });

  it("throws when required permission is missing", () => {
    const visitor = { id: "user-visitor", roles: [roles.visitor] };

    expect(() => requirePermission(visitor, permissions.manageSettings)).toThrow(
      "Missing permission: settings:manage",
    );
  });
});
