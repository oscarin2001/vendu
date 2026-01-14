import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthCookie } from "@/services/auth/adapters";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Guest-only: if an authenticated user tries to access auth routes, redirect to their dashboard
  if (pathname.startsWith("/register-company")) {
    const auth = await getAuthCookie();
    const mode = request.nextUrl.searchParams.get("mode");

    // Allow login/register forms to render even if there is a cookie
    // También permitir que usuarios con pending-onboarding se queden en /register-company
    const isAuthForm = mode === "register" || mode === "login" || !mode;
    const isMainRegisterPage = pathname === "/register-company";

    if (auth) {
      const isPending = auth.tenantId === "pending-onboarding";

      // Si el usuario tiene pending-onboarding y está en /register-company, dejarlo ahí
      // para que el wizard se muestre inline en el formulario
      if (isPending && isMainRegisterPage) {
        return NextResponse.next();
      }

      if (!isAuthForm) {
        if (!isPending) {
          return NextResponse.redirect(
            new URL(`/vendu/dashboard/${auth.tenantId}/admin`, request.url)
          );
        }

        if (
          isPending &&
          !pathname.startsWith("/register-company/onboarding-auth-company")
        ) {
          return NextResponse.redirect(
            new URL(
              "/register-company/onboarding-auth-company/company-name",
              request.url
            )
          );
        }
      }
    }
  }

  // Protect admin routes
  if (pathname.startsWith("/vendu/dashboard/")) {
    const auth = await getAuthCookie();

    if (!auth) {
      return NextResponse.redirect(
        new URL("/register-company?mode=login", request.url)
      );
    }

    // Check if slug matches
    const slugFromUrl = pathname.split("/")[3]; // /vendu/dashboard/[slug]/...
    if (auth.tenantId === "pending-onboarding") {
      return NextResponse.redirect(
        new URL(
          "/register-company/onboarding-auth-company/company-name",
          request.url
        )
      );
    }

    if (slugFromUrl !== auth.tenantId) {
      return NextResponse.redirect(
        new URL("/register-company?mode=login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/vendu/dashboard/:path*",
    "/register-company",
    "/register-company/:path*",
  ],
};
