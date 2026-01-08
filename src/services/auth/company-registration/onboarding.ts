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

  const existingNames = await prisma.tbcompanies.findMany({
    select: { name: true },
  });
  const normalizedName = name.toLocaleLowerCase();
  const hasInsensitiveMatch = existingNames.some(
    (item) => item.name.toLocaleLowerCase() === normalizedName
  );

  if (hasInsensitiveMatch) {
    throw new Error("Ya existe una empresa con ese nombre");
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
