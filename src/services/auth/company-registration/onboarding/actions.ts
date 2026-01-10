"use server";

import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import { generateUniqueSlug } from "../../../../lib/utils";
import { createCompanyFromOnboarding } from "./create-company";

export async function saveCompanyData(
  formData: FormData,
  clientMeta?: { ip?: string; ua?: string }
) {
  const name = String(formData.get("name") || "").trim();
  const country = String(formData.get("country") || "").trim();
  const taxId = String(formData.get("taxId") || "").trim() || undefined;
  const taxIdPath =
    String(formData.get("taxIdPath") || "").trim() || undefined;
  const businessName =
    String(formData.get("businessName") || "").trim() || undefined;
  const fiscalAddress =
    String(formData.get("fiscalAddress") || "").trim() || undefined;
  const department =
    String(formData.get("department") || "").trim() || undefined;
  const commerceType =
    String(formData.get("commerceType") || "").trim() || undefined;
  const description =
    String(formData.get("description") || "").trim() || undefined;
  const vision = String(formData.get("vision") || "").trim() || undefined;
  const mission = String(formData.get("mission") || "").trim() || undefined;
  const openedAt = String(formData.get("openedAt") || "").trim() || undefined;
  const tosAccepted = String(formData.get("tosAccepted") || "") === "true";
  const tosRead = String(formData.get("tosRead") || "") === "true";

  if (!name || !country) {
    return { success: false, error: "Datos incompletos" };
  }

  try {
    // Generate unique slug
    let slug = generateUniqueSlug(name);
    let counter = 1;
    while (await prisma.tbcompanies.findFirst({ where: { slug } })) {
      slug = `${generateUniqueSlug(name)}-${counter}`;
      counter++;
    }

    // Check if slug already exists
    const existingSlug = await prisma.tbcompanies.findFirst({
      where: { slug },
    });

    if (existingSlug) {
      return {
        success: false,
        error: "Ya existe una empresa con un nombre similar",
      };
    }

    // Create company
    const company = await prisma.tbcompanies.create({
      // casting to any because Prisma client may need regeneration after schema change
      data: {
        name,
        taxId,
        taxIdPath,
        businessName,
        fiscalAddress,
        country,
        department,
        commerceType,
        description,
        vision,
        mission,
        openedAt: openedAt ? new Date(openedAt) : undefined,
        tosRead: tosRead,
        tosReadAt: tosRead ? new Date() : undefined,
        tosAccepted: tosAccepted,
        tosAcceptedAt: tosAccepted ? new Date() : undefined,
        tosAcceptedIp: clientMeta?.ip || undefined,
        tosAcceptedUa: clientMeta?.ua || undefined,
        slug,
      } as any,
    });

    return { success: true, company };
  } catch (err: any) {
    return { success: false, error: err.message || "Error al guardar empresa" };
  }
}

export async function saveOwnerData(formData: FormData) {
  // TODO: Save to DB or session
  return { owner: Object.fromEntries(formData) };
}

export async function saveBranchData(formData: FormData) {
  // TODO: Save to DB or session
  return { branch: Object.fromEntries(formData) };
}

export async function saveWarehouseData(formData: FormData) {
  // TODO: Save to DB or session
  return { warehouse: Object.fromEntries(formData) };
}

export async function saveFiscalData(formData: FormData) {
  // TODO: Save to DB or session
  return { fiscal: Object.fromEntries(formData) };
}

export async function finalizeOnboarding() {
  // TODO: Create company, branches, employee, subscription in DB
  // Clear session
  redirect("/(dashboard)/1/admin"); // TODO: Get actual tenantId
}

export async function createCompanyFromOnboardingAction(data: any) {
  try {
    const result = await createCompanyFromOnboarding(data);
    // Clear session after success
    // TODO: Clear session
    return { success: true, company: result.company };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
