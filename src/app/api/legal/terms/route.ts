import { NextResponse } from "next/server";
import { getTermsContent } from "@/services/auth/company-registration/legal";

export async function GET() {
  const content = getTermsContent();
  return NextResponse.json({ content });
}
