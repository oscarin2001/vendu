import fs from "fs";
import path from "path";

export function getTermsContent(): string {
  const filePath = path.join(process.cwd(), "LEGAL", "TERMS.md");
  let content = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf-8")
    : "";
  if (!content) {
    // Fallback removed, return empty or default
    content = "Términos no disponibles";
  }
  return content;
}

export function getAUPContent(): string {
  const filePath = path.join(process.cwd(), "LEGAL", "AUP.md");
  let content = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf-8")
    : "";
  if (!content) {
    content = "Política no disponible";
  }
  return content;
}
