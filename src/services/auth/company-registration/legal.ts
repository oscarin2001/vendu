import fs from "fs";
import path from "path";

export function getTermsContent(): string {
  const filePath = path.join(
    process.cwd(),
    "src",
    "services",
    "auth",
    "company-registration",
    "LEGAL",
    "TERMS.md"
  );
  let content = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf-8")
    : "";
  if (!content) {
    content = "Términos no disponibles";
  }
  return content;
}

export function getAUPContent(): string {
  const filePath = path.join(
    process.cwd(),
    "src",
    "services",
    "auth",
    "company-registration",
    "LEGAL",
    "AUP.md"
  );
  let content = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf-8")
    : "";
  if (!content) {
    content = "Política no disponible";
  }
  return content;
}
