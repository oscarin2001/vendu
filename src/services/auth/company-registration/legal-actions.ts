"use server";

import {
  getTermsContent,
  getAUPContent,
} from "@/services/auth/company-registration/legal";

export async function getTerms(companyName?: string) {
  const content = getTermsContent();
  if (companyName) {
    return content.replace(
      /\[NOMBRE_DE_LA_EMPRESA\]|\[EMPRESA\]/g,
      companyName
    );
  }
  return content;
}

export async function getAUP(companyName?: string) {
  const content = getAUPContent();
  if (companyName) {
    return content.replace(
      /\[NOMBRE_DE_LA_EMPRESA\]|\[EMPRESA\]/g,
      companyName
    );
  }
  return content;
}
