import crypto from "node:crypto";

type CreateAdminSessionTokenInput = {
  email: string;
  expiresAt: number;
  secret: string;
};

type VerifyAdminSessionTokenInput = {
  token: string;
  now: number;
  secret: string;
};

export function parseAdminSessionToken(token: string) {
  const [payloadBase64, signature] = token.split(".");
  const payload = JSON.parse(Buffer.from(payloadBase64, "base64url").toString("utf8")) as {
    email: string;
    expiresAt: number;
  };

  return {
    payload,
    payloadBase64,
    signature
  };
}

export function createAdminSessionToken(input: CreateAdminSessionTokenInput) {
  const payloadBase64 = Buffer.from(
    JSON.stringify({
      email: input.email,
      expiresAt: input.expiresAt
    }),
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", input.secret)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

export function verifyAdminSessionToken(input: VerifyAdminSessionTokenInput) {
  try {
    const { payload, payloadBase64, signature } = parseAdminSessionToken(input.token);
    const expectedSignature = crypto
      .createHmac("sha256", input.secret)
      .update(payloadBase64)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return null;
    }

    if (payload.expiresAt <= input.now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
