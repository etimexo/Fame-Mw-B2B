import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "fameme_session";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 16) {
    return secret;
  }
  // Safe ephemeral fallback for dev / build
  return "fameme-b2b-ephemeral-secret-key-32chars!";
}

/**
 * Hash password using PBKDF2 with a cryptographically secure random salt
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return { hash, salt };
}

/**
 * Verify password against stored PBKDF2 hash and salt
 */
export function verifyPassword(
  password: string,
  storedHash: string,
  storedSalt: string
): boolean {
  try {
    const computedHash = crypto
      .pbkdf2Sync(password, storedSalt, 100000, 64, "sha512")
      .toString("hex");
    return crypto.timingSafeEqual(
      Buffer.from(computedHash, "hex"),
      Buffer.from(storedHash, "hex")
    );
  } catch {
    return false;
  }
}

/**
 * Sign session token: userId.expiresAt.signature
 */
export function signSessionToken(userId: string): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `${userId}.${expiresAt}`;
  const hmac = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${hmac}`;
}

/**
 * Verify and decode session token. Returns userId if valid, null if expired or tampered.
 */
export function verifySessionToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [userId, expiresAtStr, providedHmac] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return null;
    }
    const payload = `${userId}.${expiresAtStr}`;
    const expectedHmac = crypto
      .createHmac("sha256", getSecret())
      .update(payload)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(providedHmac, "hex"),
      Buffer.from(expectedHmac, "hex")
    );
    return isValid ? userId : null;
  } catch {
    return null;
  }
}

/**
 * Set the authentication session cookie
 */
export async function setSessionCookie(userId: string) {
  const token = signSessionToken(userId);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Clear the session cookie
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Read current authenticated user id from request cookies
 */
export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
