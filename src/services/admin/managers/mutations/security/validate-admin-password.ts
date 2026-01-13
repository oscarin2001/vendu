"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

interface ValidateAdminPasswordParams {
  tenantId: string;
  password: string;
  employeeId?: number;
  adminEmail?: string;
}

/**
 * Validate admin password
 * Supports legacy signature (tenantId, adminEmail, password) for backward compatibility
 */
export async function validateAdminPassword(
  tenantParams: string | ValidateAdminPasswordParams,
  adminEmail?: string,
  password?: string
) {
  let tenantId: string;
  let passwordInput: string | undefined;
  let resolvedEmployeeId: number | undefined;
  let resolvedAdminEmail: string | undefined;

  if (typeof tenantParams === "string") {
    tenantId = tenantParams;
    resolvedAdminEmail = adminEmail;
    passwordInput = password;
  } else {
    tenantId = tenantParams.tenantId;
    passwordInput = tenantParams.password;
    resolvedEmployeeId = tenantParams.employeeId;
    resolvedAdminEmail = tenantParams.adminEmail;
  }

  if (!passwordInput || !passwordInput.trim()) {
    throw new Error("La contraseña es obligatoria");
  }

  if (passwordInput.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }

  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
    select: { PK_company: true },
  });

  if (!company) {
    throw new Error("Empresa no encontrada");
  }

  let authRecord: { password: string } | null = null;

  if (resolvedEmployeeId) {
    const employee = await prisma.tbemployee_profiles.findUnique({
      where: { PK_employee: resolvedEmployeeId },
      select: {
        FK_company: true,
        auth: {
          select: { password: true, FK_company: true, isActive: true },
        },
      },
    });

    if (
      !employee ||
      !employee.auth ||
      !employee.auth.isActive ||
      employee.auth.FK_company !== company.PK_company
    ) {
      throw new Error("No se pudo verificar al usuario actual");
    }

    authRecord = employee.auth;
  }

  if (!authRecord && resolvedAdminEmail) {
    authRecord = await prisma.tbauth.findFirst({
      where: {
        username: resolvedAdminEmail,
        FK_company: company.PK_company,
        isActive: true,
      },
      select: { password: true },
    });
  }

  if (!authRecord) {
    authRecord = await prisma.tbauth.findFirst({
      where: {
        FK_company: company.PK_company,
        isActive: true,
        privilege: { privilegeCode: "SYS_AD" },
      },
      orderBy: { PK_auth: "asc" },
      select: { password: true },
    });
  }

  if (!authRecord) {
    throw new Error(
      "No se encontró un administrador para validar la contraseña"
    );
  }

  const passwordMatches = await bcrypt.compare(
    passwordInput,
    authRecord.password
  );

  if (!passwordMatches) {
    throw new Error("La contraseña no coincide");
  }

  return { success: true };
}
