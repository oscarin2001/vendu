"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setManagerAuthCookie } from "../adapters";
import type { ManagerLoginResult, ManagerAuthPayload } from "../types";

/**
 * Valida las credenciales del manager contra la base de datos
 */
export async function validateManagerCredentials(
  email: string,
  password: string
): Promise<ManagerLoginResult> {
  // Buscar el auth por username (email)
  const auth = await prisma.tbauth.findUnique({
    where: { username: email.toLowerCase().trim() },
    include: {
      employeeProfile: {
        include: {
          company: true,
          managerBranches: {
            include: {
              branch: true,
            },
          },
          managerWarehouses: {
            include: {
              warehouse: true,
            },
          },
        },
      },
      privilege: true,
    },
  });

  if (!auth) {
    return { ok: false, error: "Credenciales inválidas" };
  }

  // Verificar que sea un manager (no admin)
  if (auth.privilege.privilegeCode === "SYS_AD") {
    return { ok: false, error: "Acceso no autorizado para este portal" };
  }

  // Verificar contraseña
  const isValidPassword = await bcrypt.compare(password, auth.password);
  if (!isValidPassword) {
    return { ok: false, error: "Credenciales inválidas" };
  }

  // Verificar que esté activo
  if (!auth.isActive) {
    return { ok: false, error: "Cuenta desactivada. Contacte al administrador" };
  }

  const profile = auth.employeeProfile;
  if (!profile) {
    return { ok: false, error: "Perfil de empleado no encontrado" };
  }

  const tenantId = profile.company?.slug;
  if (!tenantId) {
    return { ok: false, error: "Empresa no configurada" };
  }

  return {
    ok: true,
    tenantId,
    redirectTo: `/vendu/dashboard/${tenantId}/manager`,
    manager: {
      id: profile.PK_employee,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: auth.username,
    },
  };
}
