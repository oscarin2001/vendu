import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function verifyToken(token: string | undefined) {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return { error: String(err) };
  }
}

export async function GET(request: NextRequest) {
  const cookies = request.cookies.getAll();
  const token = request.cookies.get("auth-token")?.value;
  const payload = await verifyToken(token);

  return NextResponse.json({
    cookies,
    token: token ? "present" : "missing",
    payload,
  });
}
