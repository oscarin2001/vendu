"use server";

import {
  createCompany,
  validateCompanyName,
} from "@/services/auth/company-registration/onboarding";
import { headers } from "next/headers";

export async function validateCompanyNameAction(name: string) {
  try {
    console.log("Server: validateCompanyNameAction called with:", name);
    const isValid = await validateCompanyName(name);
    console.log("Server: validateCompanyName returned:", isValid);
    const result = { success: true, isAvailable: isValid };
    console.log("Server: Returning result:", result);
    return result;
  } catch (error: any) {
    console.error("Server: Validation error:", error);
    return { success: false, error: error.message };
  }
}

export async function createCompanyAction(data: {
  name: string;
  country: string;
  phone: string;
  department?: string;
  commerceType?: string;
  description?: string;
  vision?: string;
  mission?: string;
  openedAt?: string;
  tosAccepted: boolean;
  tosRead: boolean;
}) {
  try {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for") ||
      headersList.get("x-real-ip") ||
      "unknown";
    const ua = headersList.get("user-agent") || "unknown";

    const company = await createCompany({
      ...data,
      ip,
      ua,
    });

    return { success: true, company };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
