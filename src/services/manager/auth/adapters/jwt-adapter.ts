/**
 * Adaptadores JWT para autenticación de managers
 */
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import type { ManagerAuthPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const MANAGER_COOKIE_NAME = "manager-auth-token";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 horas

export function signManagerJwt(payload: ManagerAuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyManagerJwt(token: string): ManagerAuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as ManagerAuthPayload;
  } catch {
    return null;
  }
}

export async function setManagerAuthCookie(payload: ManagerAuthPayload) {
  const token = signManagerJwt(payload);
  const cookieStore = await cookies();
  
  cookieStore.set(MANAGER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function getManagerAuthCookie(): Promise<ManagerAuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(MANAGER_COOKIE_NAME)?.value;

  if (!token) return null;

  return verifyManagerJwt(token);
}

export async function clearManagerAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(MANAGER_COOKIE_NAME);
}

export async function isManagerAuthenticated(): Promise<boolean> {
  const auth = await getManagerAuthCookie();
  return auth !== null;
}
