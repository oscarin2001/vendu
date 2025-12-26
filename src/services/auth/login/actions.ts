"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
// TODO: import login service or database check

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    throw new Error("Usuario y contraseña son obligatorios");
  }

  // TODO: Implement login logic, check user in database, verify password
  // For now, assume success and redirect
  // This is placeholder

  // Example: const user = await prisma.user.findUnique({ where: { username } });
  // if (!user || !await bcrypt.compare(password, user.passwordHash)) {
  //   throw new Error("Credenciales inválidas");
  // }

  // redirect(`/(dashboard)/${user.tenantId}/admin`);

  // Placeholder redirect
  redirect(`/(dashboard)/1/admin`); // TODO: get actual tenantId
}
