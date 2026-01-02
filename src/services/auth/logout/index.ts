"use server";

import { redirect } from "next/navigation";
import { clearAuthCookie } from "../adapters";

export async function logoutAction() {
  await clearAuthCookie();
  redirect("/");
}
