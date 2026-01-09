import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/services/auth/redirection-handler";

interface CreateCompanyData {
  name: string;
  country: string;
  department?: string;
  commerceType?: string;
  description?: string;
  vision?: string;
  mission?: string;
  openedAt?: string;
  tosAccepted: boolean;
  tosRead: boolean;
  ip?: string;
  ua?: string;
}

export async function validateCompanyName(name: string): Promise<boolean> {
  console.log("validateCompanyName: Called with name:", name);

  if (!name || name.trim().length === 0) {
    console.log("validateCompanyName: Name is empty");
    return false;
  }

  console.log("validateCompanyName: Fetching existing companies");
  const existingNames = await prisma.tbcompanies.findMany({
    select: { name: true },
  });

  console.log("validateCompanyName: Existing companies count:", existingNames.length);
  console.log("validateCompanyName: Existing company names:", existingNames.map(c => c.name));

  const normalizedName = name.toLocaleLowerCase().trim();
  console.log("validateCompanyName: Normalized input name:", normalizedName);

  const hasInsensitiveMatch = existingNames.some(
    (item) => item.name.toLocaleLowerCase() === normalizedName
  );

  console.log("validateCompanyName: Has match:", hasInsensitiveMatch);
  const result = !hasInsensitiveMatch;
  console.log("validateCompanyName: Returning (isAvailable):", result);

  return result;
}

export async function createCompany(data: CreateCompanyData) {
  const {
    name,
    country,
    department,
    commerceType,
    description,
    vision,
    mission,
    openedAt,
    tosAccepted,
    tosRead,
    ip,
    ua,
  } = data;

  if (!name || !country || !openedAt) {
    throw new Error("Datos incompletos");
  }

  const slug = await generateUniqueSlug(name);

  const company = await prisma.tbcompanies.create({
    data: {
      name,
      country,
      department,
      commerceType,
      description,
      vision,
      mission,
      openedAt: openedAt ? new Date(openedAt) : undefined,
      tosRead,
      tosReadAt: tosRead ? new Date() : undefined,
      tosAccepted,
      tosAcceptedAt: tosAccepted ? new Date() : undefined,
      tosAcceptedIp: ip,
      tosAcceptedUa: ua,
      slug,
    } as any,
  });

  return company;
}
