import { NextResponse } from "next/server";
import { clearManagerAuthCookie } from "@/services/manager/auth/server";

export async function POST() {
  await clearManagerAuthCookie();
  return NextResponse.redirect(new URL("/auth/manager/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
}

export async function GET() {
  await clearManagerAuthCookie();
  return NextResponse.redirect(new URL("/auth/manager/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
}
