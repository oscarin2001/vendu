"use server";

import { prisma } from "@/lib/prisma";
import { SystemSettings } from "../types";

export async function updateSystemSettings(
  employeeId: number,
  settings: SystemSettings
) {
  try {
    // Convert theme string to enum value
    const themeEnum = settings.theme.toUpperCase() as
      | "LIGHT"
      | "DARK"
      | "SYSTEM";

    const updatedProfile = await prisma.tbemployee_profiles.update({
      where: {
        PK_employee: employeeId,
      },
      data: {
        theme: themeEnum,
        notifications: settings.notifications,
        language: settings.language,
      },
      select: {
        theme: true,
        notifications: true,
        language: true,
      },
    });

    return {
      success: true,
      data: {
        theme: updatedProfile.theme?.toLowerCase() as
          | "light"
          | "dark"
          | "system",
        notifications: updatedProfile.notifications ?? true,
        language: updatedProfile.language ?? "es",
      },
    };
  } catch (error) {
    console.error("Error updating system settings:", error);
    return {
      success: false,
      error: "Failed to update system settings",
    };
  }
}
