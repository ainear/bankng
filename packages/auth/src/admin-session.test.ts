import { describe, expect, it } from "vitest";
import {
  createAdminSessionToken,
  parseAdminSessionToken,
  verifyAdminSessionToken
} from "./admin-session";

describe("admin session token", () => {
  it("creates and verifies a signed token", () => {
    const secret = "local-test-secret";
    const token = createAdminSessionToken({
      email: "admin@bankng.local",
      expiresAt: 1_800_000_000_000,
      secret
    });

    const verified = verifyAdminSessionToken({
      token,
      now: 1_700_000_000_000,
      secret
    });

    expect(verified).toEqual({
      email: "admin@bankng.local",
      expiresAt: 1_800_000_000_000
    });
  });

  it("rejects tampered token payload", () => {
    const secret = "local-test-secret";
    const token = createAdminSessionToken({
      email: "admin@bankng.local",
      expiresAt: 1_800_000_000_000,
      secret
    });
    const parsed = parseAdminSessionToken(token);
    const tamperedToken = `${Buffer.from(
      JSON.stringify({ email: "hacker@bankng.local", expiresAt: parsed.payload.expiresAt }),
    ).toString("base64url")}.${parsed.signature}`;

    expect(
      verifyAdminSessionToken({
        token: tamperedToken,
        now: 1_700_000_000_000,
        secret
      }),
    ).toBeNull();
  });

  it("rejects expired token", () => {
    const secret = "local-test-secret";
    const token = createAdminSessionToken({
      email: "admin@bankng.local",
      expiresAt: 1_700_000_000_000,
      secret
    });

    expect(
      verifyAdminSessionToken({
        token,
        now: 1_700_000_000_001,
        secret
      }),
    ).toBeNull();
  });
});
