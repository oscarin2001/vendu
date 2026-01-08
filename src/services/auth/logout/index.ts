"use server";

import { redirect } from "next/navigation";
import { clearAuthCookie } from "../adapters";

export async function logoutAction() {
  await clearAuthCookie();
  // Redirect user to login/register page after logout
  redirect("/register-company?mode=login");
}
