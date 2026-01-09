"use server";

import {
  createCompany,
  validateCompanyName,
} from "@/services/auth/company-registration/onboarding";
import { headers } from "next/headers";

export async function validateCompanyNameAction(name: string) {
  try {
    const isValid = await validateCompanyName(name);
    return { success: true, isAvailable: isValid };
  } catch (error: any) {
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
