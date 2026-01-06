"use server";

import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import { generateUniqueSlug } from "../../redirection-handler";

export async function saveCompanyData(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const country = String(formData.get("country") || "").trim();

  if (!name || !country) {
    return { success: false, error: "Datos incompletos" };
  }

  try {
    // Check if company name already exists
    const existingCompany = await prisma.tbcompanies.findFirst({
      where: { name: name },
    });

    if (existingCompany) {
      return { success: false, error: "Ya existe una empresa con ese nombre" };
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(name);

    // Create company
    const company = await prisma.tbcompanies.create({
      data: {
        name,
        country,
        slug,
      },
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
