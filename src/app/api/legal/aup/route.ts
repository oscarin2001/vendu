import { NextResponse } from "next/server";
import { getAUPContent } from "@/services/auth/company-registration/legal";

export async function GET() {
  const content = getAUPContent();
  return NextResponse.json({ content });
}
