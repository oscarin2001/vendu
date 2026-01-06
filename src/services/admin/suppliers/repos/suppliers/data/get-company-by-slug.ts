import { prisma } from "@/lib/prisma";

export async function getCompanyBySlug(slug: string) {
  return await prisma.tbcompanies.findUnique({
    where: { slug },
  });
}
