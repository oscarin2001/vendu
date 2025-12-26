"use server";

import { redirect } from "next/navigation";
// TODO: Import Prisma and implement DB operations

export async function saveCompanyData(formData: FormData) {
  // TODO: Save to DB or session
  redirect("/register-company/onboarding-auth-company/owner");
}

export async function saveOwnerData(formData: FormData) {
  // TODO: Save to DB or session
  redirect("/register-company/onboarding-auth-company/branch");
}

export async function saveBranchData(formData: FormData) {
  // TODO: Save to DB or session
  redirect("/register-company/onboarding-auth-company/warehouse");
}

export async function saveWarehouseData(formData: FormData) {
  // TODO: Save to DB or session
  redirect("/register-company/onboarding-auth-company/fiscal");
}

export async function saveFiscalData(formData: FormData) {
  // TODO: Save to DB or session
  redirect("/register-company/onboarding-auth-company/confirmation");
}

export async function finalizeOnboarding() {
  // TODO: Create company, branches, employee, subscription in DB
  // Clear session
  redirect("/(dashboard)/1/admin"); // TODO: Get actual tenantId
}