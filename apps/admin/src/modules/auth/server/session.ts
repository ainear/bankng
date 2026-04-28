import { createAdminSessionToken, verifyAdminSessionToken } from "@bankng/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_SESSION_COOKIE = "bankng_admin_session";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 8;

function readRequiredEnv(name: "AUTH_SECRET" | "ADMIN_EMAIL" | "ADMIN_PASSWORD") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export function getAdminCredentials() {
  return {
    email: readRequiredEnv("ADMIN_EMAIL"),
    password: readRequiredEnv("ADMIN_PASSWORD")
  };
}

export function createAdminCookieValue(email: string) {
  return createAdminSessionToken({
    email,
    expiresAt: Date.now() + SESSION_DURATION_MS,
    secret: readRequiredEnv("AUTH_SECRET")
  });
}

export function verifyAdminCookieValue(token: string | undefined) {
  if (!token) {
    return null;
  }

  return verifyAdminSessionToken({
    token,
    now: Date.now(),
    secret: readRequiredEnv("AUTH_SECRET")
  });
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = verifyAdminCookieValue(token);

  if (!session) {
    redirect("/login");
  }

  return session;
}
