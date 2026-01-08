"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { setAuthCookie } from "../adapters";

type LoginSuccess = {
  ok: true;
  slug: string;
  onboardingCompleted: boolean;
  redirectTo: string;
};

type LoginOnboardingPending = {
  onboardingRequired: true;
  redirectTo: string;
};

type LoginError = {
  error: string;
};

export type LoginResult = LoginSuccess | LoginOnboardingPending | LoginError;

export async function loginAction(
  prevState: unknown,
  formData: FormData
): Promise<LoginResult> {
  const username = String(formData.get("username") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return { error: "Usuario y/o contraseña incorrectos" };
  }

  // Validate email/username format (basic)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(username)) {
    return { error: "Usuario y/o contraseña incorrectos" };
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
      return { error: "Usuario y/o contraseña incorrectos" };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { error: "Usuario y/o contraseña incorrectos" };
    }

    // Check if user is active
    if (!user.isActive) {
      return { error: "Usuario y/o contraseña incorrectos" };
    }

    const tenantId = user.company?.slug;
    const onboardingCompleted = Boolean(
      (user.company as { onboardingCompleted?: boolean } | null)
        ?.onboardingCompleted
    );

    const onboardingRedirect = tenantId
      ? `/register-company/onboarding-auth-company/company-name?tenantId=${tenantId}`
      : "/register-company/onboarding-auth-company/company-name";

    // If company/slug is missing, we can't issue auth cookie; force onboarding route
    if (!tenantId) {
      return {
        onboardingRequired: true,
        redirectTo: onboardingRedirect,
      };
    }

    // Set authentication cookie
    await setAuthCookie({
      userId: user.PK_auth,
      username: user.username,
      tenantId,
      privilege: user.privilege.privilegeCode,
    });

    const redirectTo = onboardingCompleted
      ? `/vendu/dashboard/${tenantId}/admin`
      : onboardingRedirect;

    return {
      ok: true,
      slug: tenantId,
      onboardingCompleted,
      redirectTo,
    };
  } catch (err: any) {
    return { error: "Usuario y/o contraseña incorrectos" };
  }
}

import { getAuthCookie } from "@/services/auth/adapters";

export async function checkAuthAndRedirect() {
  const auth = await getAuthCookie();
  if (auth) {
    // Already authenticated - redirect to tenant dashboard
    redirect(`/vendu/dashboard/${auth.tenantId}/admin`);
  }
  // Not authenticated - go to login/register page
  redirect("/register-company?mode=login");
}
