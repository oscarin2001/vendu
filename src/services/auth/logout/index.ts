"use server";

import { clearAuthCookie } from "../adapters";

export async function logoutAction() {
  await clearAuthCookie();
  return { success: true };
}
