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

interface ManagerAuthPayload {
  managerId: number;
  email: string;
  tenantId: string;
  fullName: string;
}

async function verifyAdminAuth(request: NextRequest): Promise<AuthPayload | null> {
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

async function verifyManagerAuth(request: NextRequest): Promise<ManagerAuthPayload | null> {
  const token = request.cookies.get("manager-auth-token")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as unknown as ManagerAuthPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Manager login page - redirect if already authenticated
  if (pathname === "/auth/manager/login") {
    const managerAuth = await verifyManagerAuth(request);
    if (managerAuth) {
      return NextResponse.redirect(
        new URL(`/vendu/dashboard/${managerAuth.tenantId}/manager`, request.url)
      );
    }
    return NextResponse.next();
  }

  // Protect manager dashboard routes
  if (pathname.includes("/manager") && pathname.startsWith("/vendu/dashboard/")) {
    const managerAuth = await verifyManagerAuth(request);
    if (!managerAuth) {
      return NextResponse.redirect(new URL("/auth/manager/login", request.url));
    }
    const slugFromUrl = pathname.split("/")[3];
    if (slugFromUrl !== managerAuth.tenantId) {
      return NextResponse.redirect(new URL("/auth/manager/login", request.url));
    }
    return NextResponse.next();
  }

  // Guest-only: if an authenticated user tries to access auth routes, redirect to their dashboard
  if (pathname.startsWith("/register-company")) {
    const auth = await verifyAdminAuth(request);
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
  if (pathname.startsWith("/vendu/dashboard/") && pathname.includes("/admin")) {
    const auth = await verifyAdminAuth(request);

    if (!auth) {
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
    "/auth/manager/:path*",
  ],
};
