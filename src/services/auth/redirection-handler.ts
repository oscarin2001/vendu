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

export function getPostLoginRedirect(user: UserWithCompany): string {
  if (!user.company) {
    return "/register-company?mode=register";
  }

  const slug = user.company.slug || "default";
  const onboardingCompleted = !!user.company.onboardingCompleted;

  if (!onboardingCompleted) {
    return `/register-company?mode=register${slug ? `&tenantId=${slug}` : ""}`;
  }

  return `/vendu/dashboard/${slug}/admin`;
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
