"use client";

import React from "react";

interface TermsContentProps {
  companyName?: string;
}

export function TermsContent({ companyName }: TermsContentProps) {
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    fetch("/api/legal/terms")
      .then((r) => r.json())
      .then((d) => {
        let text = d.content || "";
        if (companyName) {
          text = text.replace(/\[NOMBRE_DE_LA_EMPRESA\]|\[EMPRESA\]/g, companyName);
        }
        setContent(text);
      });
  }, [companyName]);

  return (
    <div className="prose mx-auto py-8">
      <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br/>") }} />
    </div>
  );
}