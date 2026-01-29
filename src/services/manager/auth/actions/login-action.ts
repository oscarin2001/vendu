"use server";

import { setManagerAuthCookie } from "../adapters";
import { validateManagerCredentials } from "../services";
import type { ManagerLoginResult, ManagerAuthPayload } from "../types";

/**
 * Action de login para managers
 */
export async function managerLoginAction(
  prevState: unknown,
  formData: FormData
): Promise<ManagerLoginResult> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  // Validaciones básicas
  if (!email || !password) {
    return { ok: false, error: "Correo y contraseña son requeridos" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { ok: false, error: "Formato de correo inválido" };
  }

  // Validar credenciales
  const result = await validateManagerCredentials(email, password);

  if (!result.ok) {
    return result;
  }

  // Crear payload y establecer cookie
  const payload: ManagerAuthPayload = {
    managerId: result.manager.id,
    authId: result.manager.id, // Se actualizará con el authId real
    email: result.manager.email,
    tenantId: result.tenantId,
    firstName: result.manager.firstName,
    lastName: result.manager.lastName,
    role: "MANAGER",
  };

  await setManagerAuthCookie(payload);

  return result;
}
