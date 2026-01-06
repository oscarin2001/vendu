import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";

export interface UserWithCompany {
  PK_auth: number;
  username: string;
  company?: {
    slug?: string;
    name?: string;
    onboardingCompleted?: boolean;
  } | null;
}

export function handlePostLoginRedirect(user: UserWithCompany) {
  if (!user.company) {
    // No company, redirect to onboarding
    redirect("/register-company");
  }

  // Assume onboarding completed if company exists
  // In future, check user.company.onboardingCompleted
  const slug = user.company.slug || "default";
  redirect(`/vendu/dashboard/${slug}/admin`);
}

export function generateSlug(companyName: string): string {
  return companyName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export async function generateUniqueSlug(companyName: string): Promise<string> {
  const baseSlug = generateSlug(companyName);
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.tbcompanies.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
