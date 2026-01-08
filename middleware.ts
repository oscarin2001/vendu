import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthCookie } from "@/services/auth/adapters";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Guest-only: if an authenticated user tries to access auth routes, redirect to their dashboard
  if (pathname.startsWith("/register-company")) {
    const auth = await getAuthCookie();
    if (auth) {
      return NextResponse.redirect(
        new URL(`/vendu/dashboard/${auth.tenantId}/admin`, request.url)
      );
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
