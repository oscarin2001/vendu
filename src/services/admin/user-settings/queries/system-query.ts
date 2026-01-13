"use server";

import { prisma } from "@/lib/prisma";

export async function getSystemSettings(employeeId: number) {
  try {
    const profile = await prisma.tbemployee_profiles.findUnique({
      where: {
        PK_employee: employeeId,
      },
      select: {
        theme: true,
        notifications: true,
        language: true,
      },
    });

    if (!profile) {
      return {
        success: false,
        error: "Employee profile not found",
      };
    }

    return {
      success: true,
      data: {
        theme:
          (profile.theme?.toLowerCase() as "light" | "dark" | "system") ||
          "system",
        notifications: profile.notifications ?? true,
        language: profile.language ?? "es",
      },
    };
  } catch (error) {
    console.error("Error fetching system settings:", error);
    return {
      success: false,
      error: "Failed to fetch system settings",
    };
  }
}
