"use server";

import { redirect } from "next/navigation";
import { getManagerAuthCookie } from "../adapters";

/**
 * Verifica el estado de autenticación del manager
 */
export async function checkManagerAuthStatus(): Promise<{
  authenticated: boolean;
  tenantId: string | null;
  managerId: number | null;
}> {
  const auth = await getManagerAuthCookie();
  
  if (!auth) {
    return { authenticated: false, tenantId: null, managerId: null };
  }

  return {
    authenticated: true,
    tenantId: auth.tenantId,
    managerId: auth.managerId,
  };
}

/**
 * Verifica auth y redirige según estado
 */
export async function checkManagerAuthAndRedirect() {
  const auth = await getManagerAuthCookie();
  
  if (auth) {
    redirect(`/vendu/dashboard/${auth.tenantId}/manager`);
  }
  
  redirect("/auth/manager/login");
}
