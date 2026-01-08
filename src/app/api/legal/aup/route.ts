import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "LEGAL", "AUP.md");
  let content = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf-8")
    : "";
  if (!content) {
    const fallbackPath = path.join(
      process.cwd(),
      "src",
      "services",
      "legal",
      "aup-fallback.txt"
    );
    content = fs.existsSync(fallbackPath)
      ? fs.readFileSync(fallbackPath, "utf-8")
      : "";
  }
  return NextResponse.json({ content });
}
