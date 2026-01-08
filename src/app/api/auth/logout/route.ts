import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/services/auth/adapters";

export async function GET(request: Request) {
  await clearAuthCookie();
  const url = new URL("/register-company?mode=login", request.url);
  return NextResponse.redirect(url);
}

export async function POST(request: Request) {
  // Support POST as well for flexibility
  return GET(request);
}
