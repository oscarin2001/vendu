"use server";

import { setAuthCookie } from "../adapters";
import { createUser } from "../services/authService";

export async function registerAction(prevState: any, formData: FormData) {
  const username = String(formData.get("username") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  // Validación previa
  if (!username || !password || !email) {
    return { error: "Todos los campos son obligatorios" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(username) || !emailRegex.test(email)) {
    return { error: "Formato de email inválido" };
  }

  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres" };
  }

  try {
    const { user, privilegeCode } = await createUser({
      username,
      password,
      email,
    });

    await setAuthCookie({
      userId: user.PK_auth,
      username: user.username,
      tenantId: "pending-onboarding",
      privilege: privilegeCode,
    });
    return { ok: true };
  } catch (err: any) {
    if (err.message.includes("ya existente")) {
      return { error: "Usuario ya existente" };
    }
    return { error: err.message || "Error al registrarse" };
  }
}
