"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { setAuthCookie } from "../adapters";
import { handlePostLoginRedirect } from "../redirection-handler";

export async function loginAction(prevState: any, formData: FormData) {
  const username = String(formData.get("username") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return { error: "Usuario o contraseña incorrectos" };
  }

  // Validate email/username format (basic)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(username)) {
    return { error: "Usuario o contraseña incorrectos" };
  }

  try {
    // Find user in database
    const user = await prisma.tbauth.findUnique({
      where: { username },
      include: {
        company: true,
        privilege: true,
      },
    });

    if (!user) {
      return { error: "Usuario o contraseña incorrectos" };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { error: "Usuario o contraseña incorrectos" };
    }

    // Check if user is active
    if (!user.isActive) {
      return { error: "Usuario o contraseña incorrectos" };
    }

    // Get tenantId from company slug
    const tenantId = user.company?.slug;
    if (!tenantId) {
      return { error: "Usuario o contraseña incorrectos" };
    }

    // Set authentication cookie
    await setAuthCookie({
      userId: user.PK_auth,
      username: user.username,
      tenantId,
      privilege: user.privilege.privilegeCode,
    });

    // Handle post-login redirect
    handlePostLoginRedirect(user);
  } catch (err: any) {
    return { error: "Usuario o contraseña incorrectos" };
  }
}

export async function checkAuthAndRedirect() {
  redirect("/register-company?mode=login");
}
