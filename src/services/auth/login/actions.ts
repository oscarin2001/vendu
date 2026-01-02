"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { setAuthCookie, getAuthCookie } from "../adapters";

export async function loginAction(prevState: any, formData: FormData) {
  const username = String(formData.get("username") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return { error: new Error("Usuario y contraseña son obligatorios") };
  }

  // Find user in database
  const user = await prisma.tbauth.findUnique({
    where: { username },
    include: {
      company: true,
      privilege: true,
    },
  });

  if (!user) {
    return { error: new Error("Usuario o contraseña inválidos") };
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return { error: new Error("Usuario o contraseña inválidos") };
  }

  // Check if user is active
  if (!user.isActive) {
    return { error: new Error("Cuenta inactiva") };
  }

  // Get tenantId from company slug
  const tenantId = user.company?.slug;
  if (!tenantId) {
    return { error: new Error("No se pudo determinar el tenant") };
  }

  // Set authentication cookie
  await setAuthCookie({
    userId: user.PK_auth,
    username: user.username,
    tenantId,
    privilege: user.privilege.privilegeCode,
  });

  // Redirect to dashboard
  redirect(`/vendu/dashboard/${tenantId}/admin`);
}

export async function checkAuthAndRedirect() {
  const auth = await getAuthCookie();

  if (auth) {
    // User is authenticated, redirect to dashboard
    redirect(`/vendu/dashboard/${auth.tenantId}/admin`);
  } else {
    // User is not authenticated, redirect to register-company login
    redirect("/register-company?mode=login");
  }
}
