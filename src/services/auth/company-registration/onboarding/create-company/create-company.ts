"use server";

import { saveCompanyData } from "../actions";
import { getOnboardingData } from "../session";
import { prisma } from "@/lib/prisma";

export async function createCompanyFromOnboarding(sessionData?: any) {
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

  // Crear el owner como empleado
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
        // Crear cuenta de auth para el owner
        const safeUsernameBase =
          ownerData.ci || ownerData.phone || ownerData.firstName || "owner";
        const username = `${safeUsernameBase.toLowerCase()}-${result.company.slug}`;
        const auth = await prisma.tbauth.create({
          data: {
            username,
            password: "$2b$10$dummyhashedpassword", // TODO: Usar bcrypt para hashear una contraseña temporal
            FK_privilege: privilege.PK_privilege,
            FK_company: result.company.PK_company,
            accountType: "EMPLOYEE",
          },
        });

        // Crear perfil de empleado para el owner
        const employee = await prisma.tbemployee_profiles.create({
          data: {
            FK_auth: auth.PK_auth,
            FK_company: result.company.PK_company,
            firstName: ownerData.firstName,
            lastName: ownerData.lastName,
            ci: ownerData.ci || "",
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
            contractEndAt: null,
            status: "ACTIVE",
          },
        });

        // Marcar como creador de la empresa
        await prisma.tbcompanies.update({
          where: { PK_company: result.company.PK_company },
          data: { FK_createdBy: employee.PK_employee },
        });
      }
    } catch (error) {
      console.error("Error creando owner:", error);
      // No fallar el proceso si falla el owner
    }
  }

  return result;
}
