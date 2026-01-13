"use server";

import { saveCompanyData } from "../actions";
import { getOnboardingData } from "../session";
import { prisma } from "@/lib/prisma";

interface CreateCompanyOptions {
  existingAuthId?: number;
  existingUsername?: string;
}

export async function createCompanyFromOnboarding(
  sessionData?: any,
  options: CreateCompanyOptions = {}
) {
  if (!sessionData) {
    sessionData = await getOnboardingData();
  }

  if (!sessionData.company) {
    throw new Error("Datos de empresa incompletos");
  }

  const companyData = sessionData.company;
  const fiscalData = sessionData.fiscal || {};

  // Preparar los datos para saveCompanyData
  const formData = new FormData();
  formData.append("name", companyData.name || "");
  formData.append("country", companyData.country || "");
  const taxId = companyData.taxId || fiscalData.taxId || "";
  formData.append("taxId", taxId);
  const taxIdPath = companyData.taxIdPath || fiscalData.taxIdPath || "";
  formData.append("taxIdPath", taxIdPath);
  formData.append("businessName", fiscalData.businessName || "");
  formData.append("fiscalAddress", fiscalData.fiscalAddress || "");
  formData.append("department", companyData.department || "");
  formData.append("commerceType", companyData.commerceType || "");
  formData.append("description", companyData.description || "");
  formData.append("vision", companyData.vision || "");
  formData.append("mission", companyData.mission || "");
  formData.append("openedAt", companyData.openedAt || "");
  formData.append("tosAccepted", "true");
  formData.append("tosRead", "true");

  // Crear la empresa
  const result = await saveCompanyData(formData);

  if (!result.success) {
    throw new Error(result.error || "Error al crear empresa");
  }

  let ownerAuthId = options.existingAuthId;
  let ownerUsername = options.existingUsername;
  let ownerPrivilegeCode: string | undefined;

  // Crear o vincular al owner como empleado y administrador
  const ownerData = sessionData.owner;
  if (ownerData && result.company) {
    try {
      // Asegurar privilegio SYS_AD (crearlo si no existe)
      let privilege = await prisma.tbprivileges.findFirst({
        where: { privilegeCode: "SYS_AD" },
      });
      if (!privilege) {
        privilege = await prisma.tbprivileges.create({
          data: {
            privilegeName: "Administrador",
            privilegeCode: "SYS_AD",
            description: "Administrador del tenant",
          },
        });
      }

      if (privilege) {
        ownerPrivilegeCode = privilege.privilegeCode;

        if (ownerAuthId) {
          // Vincular cuenta existente creada durante el registro
          const updatedAuth = await prisma.tbauth.update({
            where: { PK_auth: ownerAuthId },
            data: {
              FK_company: result.company.PK_company,
              FK_privilege: privilege.PK_privilege,
              accountType: "EMPLOYEE",
              isActive: true,
            },
            select: { PK_auth: true, username: true },
          });

          ownerUsername = updatedAuth.username;

          const existingEmployee = await prisma.tbemployee_profiles.findUnique({
            where: { FK_auth: ownerAuthId },
          });

          const baseEmployeeData: any = {
            FK_company: result.company.PK_company,
            firstName: ownerData.firstName || "Administrador",
            lastName: ownerData.lastName || "Principal",
            phone: ownerData.phone || null,
            status: "ACTIVE",
          };

          if (ownerData.birthDate) {
            const birthDate = new Date(ownerData.birthDate);
            baseEmployeeData.birthDate = birthDate;
            baseEmployeeData.birthYear = birthDate.getFullYear();
          }

          if (ownerData.joinedAt) {
            baseEmployeeData.joinedAt = new Date(ownerData.joinedAt);
          }

          if (ownerData.contractEndAt) {
            baseEmployeeData.contractEndAt = new Date(ownerData.contractEndAt);
          }

          let employee;

          if (existingEmployee) {
            employee = await prisma.tbemployee_profiles.update({
              where: { PK_employee: existingEmployee.PK_employee },
              data: baseEmployeeData,
            });
          } else {
            const fallbackCi =
              (ownerData.ci && ownerData.ci.trim()) ||
              `ADMIN-${result.company.slug}-${ownerAuthId}`;

            employee = await prisma.tbemployee_profiles.create({
              data: {
                FK_auth: ownerAuthId,
                ci: fallbackCi,
                ...baseEmployeeData,
              },
            });
          }

          if (employee) {
            await prisma.tbcompanies.update({
              where: { PK_company: result.company.PK_company },
              data: { FK_createdBy: employee.PK_employee },
            });
          }
        } else {
          // Crear cuenta de auth para el owner cuando no existe sesión
          const safeUsernameBase =
            ownerData.ci || ownerData.phone || ownerData.firstName || "owner";
          const username = `${safeUsernameBase.toLowerCase()}-${
            result.company.slug
          }`;
          const auth = await prisma.tbauth.create({
            data: {
              username,
              password: "$2b$10$dummyhashedpassword", // TODO: Usar bcrypt para hashear una contraseña temporal
              FK_privilege: privilege.PK_privilege,
              FK_company: result.company.PK_company,
              accountType: "EMPLOYEE",
            },
          });

          ownerAuthId = auth.PK_auth;
          ownerUsername = auth.username;

          const employee = await prisma.tbemployee_profiles.create({
            data: {
              FK_auth: auth.PK_auth,
              FK_company: result.company.PK_company,
              firstName: ownerData.firstName,
              lastName: ownerData.lastName,
              ci:
                ownerData.ci || `ADMIN-${result.company.slug}-${auth.PK_auth}`,
              phone: ownerData.phone,
              birthDate: ownerData.birthDate
                ? new Date(ownerData.birthDate)
                : null,
              birthYear: ownerData.birthDate
                ? new Date(ownerData.birthDate).getFullYear()
                : null,
              joinedAt: ownerData.joinedAt
                ? new Date(ownerData.joinedAt)
                : null,
              contractEndAt: ownerData.contractEndAt
                ? new Date(ownerData.contractEndAt)
                : null,
              status: "ACTIVE",
            },
          });

          await prisma.tbcompanies.update({
            where: { PK_company: result.company.PK_company },
            data: { FK_createdBy: employee.PK_employee },
          });
        }
      }
    } catch (error) {
      console.error("Error creando o vinculando owner:", error);
      // No fallar el proceso si falla el owner
    }
  }

  return {
    ...result,
    ownerAuthId,
    ownerUsername,
    ownerPrivilegeCode,
  };
}
