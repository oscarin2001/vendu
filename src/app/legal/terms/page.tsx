import fs from "fs";
import path from "path";
import React from "react";

export default async function TermsPage() {
  const filePath = path.join(process.cwd(), "LEGAL", "TERMS.md");
  const content = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf-8")
    : "";
  return (
    <div className="prose mx-auto py-8">
      <div
        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br/>") }}
      />
    </div>
  );
}
