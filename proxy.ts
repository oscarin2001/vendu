import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface AuthPayload {
  userId: number;
  username: string;
  tenantId: string;
  privilege: string;
}

async function verifyJwtFromRequest(
  request: NextRequest,
): Promise<AuthPayload | null> {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // DEBUG - remove after testing
  console.log("[PROXY] pathname:", pathname);
  console.log("[PROXY] cookies:", request.cookies.getAll());

  // Guest-only: if an authenticated user tries to access auth routes, redirect to their dashboard
  if (pathname.startsWith("/register-company")) {
    const auth = await verifyJwtFromRequest(request);
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
            new URL(`/vendu/dashboard/${auth.tenantId}/admin`, request.url),
          );
        }

        if (
          isPending &&
          !pathname.startsWith("/register-company/onboarding-auth-company")
        ) {
          return NextResponse.redirect(
            new URL(
              "/register-company/onboarding-auth-company/company-name",
              request.url,
            ),
          );
        }
      }
    }
  }

  // Protect admin routes
  if (pathname.startsWith("/vendu/dashboard/")) {
    const auth = await verifyJwtFromRequest(request);

    console.log("[PROXY] Dashboard route - auth result:", auth);

    if (!auth) {
      console.log("[PROXY] No auth - REDIRECTING to login");
      return NextResponse.redirect(
        new URL("/register-company?mode=login", request.url),
      );
    }

    // Check if slug matches
    const slugFromUrl = pathname.split("/")[3]; // /vendu/dashboard/[slug]/...
    if (auth.tenantId === "pending-onboarding") {
      return NextResponse.redirect(
        new URL(
          "/register-company/onboarding-auth-company/company-name",
          request.url,
        ),
      );
    }

    if (slugFromUrl !== auth.tenantId) {
      return NextResponse.redirect(
        new URL("/register-company?mode=login", request.url),
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
