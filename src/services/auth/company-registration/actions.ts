"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { registerCompany } from "../../tenant/company-service";
import { normalizeBranchInput } from "../../organization/branch-service";

/**
 * Server action for company registration
 * Handles form submission, validation, and database creation
 */
export async function registerCompanyAction(formData: FormData) {
  const name = String(formData.get("name") || "");
  const taxId = formData.get("taxId")?.toString() || undefined;
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  const fullName = formData.get("fullName")?.toString() || undefined;

  const branch = normalizeBranchInput({
    address: String(formData.get("address") || ""),
    city: String(formData.get("city") || ""),
    department: formData.get("department")?.toString(),
    phone: formData.get("phone")?.toString(),
    name: formData.get("branchName")?.toString(),
  });

  if (!name || !username || !password || !branch.address || !branch.city) {
    throw new Error("Faltan campos obligatorios");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await registerCompany({
    name,
    taxId,
    username,
    passwordHash,
    fullName,
    branch,
  });

  const tenantId = result.company.PK_company;
  redirect(
    `/register-company/onboarding-auth-company/company-name?tenantId=${tenantId}`
  );
}

/**
 * Server action for completing company registration with full onboarding data
 * Handles the complete registration process after onboarding steps
 */
export async function completeCompanyRegistrationAction(formData: {
  username: string;
  password: string;
  companyName: { name: string; country: string; phone: string };
  owner: {
    firstName: string;
    lastName: string;
    phone: string;
    ci: string;
    gender: string;
  };
  branch: {
    name: string;
    address: string;
    city: string;
    department: string;
    country: string;
    phone: string;
    isWarehouse: boolean;
  };
  warehouse?: {
    hasWarehouse: boolean;
    name: string;
    address: string;
    city: string;
    department: string;
    country: string;
    phone: string;
  };
  fiscal?: { taxId: string; businessName: string; fiscalAddress: string };
}) {
  const { username, password, companyName, owner, branch, warehouse, fiscal } =
    formData;

  // Validate required fields
  if (
    !username ||
    !password ||
    !companyName.name ||
    !branch.address ||
    !branch.city
  ) {
    throw new Error("Faltan campos obligatorios");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Prepare branch data
  const branchData = normalizeBranchInput({
    address: branch.address,
    city: branch.city,
    department: branch.department,
    phone: branch.phone,
    name: branch.name,
  });

  const result = await registerCompany({
    name: companyName.name,
    taxId: fiscal?.taxId,
    username,
    passwordHash,
    fullName: `${owner.firstName} ${owner.lastName}`,
    branch: branchData,
  });

  const tenantId = result.company.PK_company;
  return { success: true, tenantId };
}
