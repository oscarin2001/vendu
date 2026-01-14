"use server";

import { getAuthCookie } from "@/services/auth/adapters";
import { queryUserAccountProfile } from "../queries/profile-query";

export interface AccountProfileData {
  authId: number;
  username: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  ci: string | null;
  birthDate: Date | null;
  joinedAt: Date | null;
  lastLogin: Date | null;
  createdAt: Date;
}

export interface AccountProfileResult {
  success: boolean;
  data?: AccountProfileData;
  error?: string;
}

/**
 * Extrae nombre y apellido del username/email
 * Ejemplo: "eriberto.lazcano@email.com" -> { firstName: "Eriberto", lastName: "Lazcano" }
 * Ejemplo: "eriberto_lazcano" -> { firstName: "Eriberto", lastName: "Lazcano" }
 * Ejemplo: "eriberto" -> { firstName: "Eriberto", lastName: "" }
 */
function extractNameFromUsername(username: string): {
  firstName: string;
  lastName: string;
} {
  // Remover el dominio del email si existe
  const localPart = username.split("@")[0];

  // Intentar separar por punto, guion bajo o guion
  const separators = /[._-]/;
  const parts = localPart.split(separators).filter(Boolean);

  if (parts.length >= 2) {
    // Capitalizar primera letra de cada parte
    const firstName =
      parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    const lastName =
      parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
    return { firstName, lastName };
  }

  // Si solo hay una parte, usar como nombre
  const firstName =
    localPart.charAt(0).toUpperCase() + localPart.slice(1).toLowerCase();
  return { firstName, lastName: "" };
}

/**
 * Server action para obtener el perfil de cuenta del usuario autenticado.
 * Obtiene los datos de autenticación (username) junto con los datos del empleado.
 */
export async function getAccountProfile(): Promise<AccountProfileResult> {
  try {
    const auth = await getAuthCookie();

    if (!auth) {
      return {
        success: false,
        error: "No hay sesión activa",
      };
    }

    const profile = await queryUserAccountProfile(auth.userId);

    if (!profile) {
      return {
        success: false,
        error: "Perfil no encontrado",
      };
    }

    const employeeProfile = profile.employeeProfile;

    // Si hay perfil de empleado, usar esos datos. Si no, extraer del username
    let firstName = employeeProfile?.firstName || "";
    let lastName = employeeProfile?.lastName || "";

    // Si no hay nombre del perfil de empleado, extraer del username
    if (!firstName) {
      const extracted = extractNameFromUsername(profile.username);
      firstName = extracted.firstName;
      lastName = extracted.lastName || lastName;
    }

    return {
      success: true,
      data: {
        authId: profile.PK_auth,
        username: profile.username,
        firstName,
        lastName,
        phone: employeeProfile?.phone || null,
        ci: employeeProfile?.ci || null,
        birthDate: employeeProfile?.birthDate || null,
        joinedAt: employeeProfile?.joinedAt || null,
        lastLogin: profile.lastLogin,
        createdAt: profile.createdAt,
      },
    };
  } catch (error) {
    console.error("Error fetching account profile:", error);
    return {
      success: false,
      error: "Error cargando datos de la cuenta",
    };
  }
}
