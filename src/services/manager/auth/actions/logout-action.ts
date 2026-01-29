"use server";

import { redirect } from "next/navigation";
import { clearManagerAuthCookie } from "../adapters";

/**
 * Action de logout para managers
 */
export async function managerLogoutAction() {
  await clearManagerAuthCookie();
  redirect("/auth/manager/login");
}
