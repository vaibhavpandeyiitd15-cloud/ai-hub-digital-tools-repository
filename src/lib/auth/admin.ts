import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/auth/constants";

export { ADMIN_COOKIE } from "@/lib/auth/constants";

function getAdminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD?.trim() || undefined;
}

export function getAdminSessionToken(): string | null {
  const password = getAdminPassword();
  if (!password) return null;
  return createHmac("sha256", password).update("ai-hub-admin-v1").digest("hex");
}

export function isValidAdminSessionToken(token: string | undefined): boolean {
  const expected = getAdminSessionToken();
  if (!expected || !token) return false;
  try {
    const a = Buffer.from(token, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

export async function setAdminSession(): Promise<void> {
  const token = getAdminSessionToken();
  if (!token) {
    throw new Error("ADMIN_PASSWORD is not configured");
  }
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export function isAdminPasswordConfigured(): boolean {
  return Boolean(getAdminPassword());
}
