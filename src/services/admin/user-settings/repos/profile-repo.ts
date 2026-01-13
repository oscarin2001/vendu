import { prisma } from "@/lib/prisma";

export async function getUserProfile(userId: number) {
  return await prisma.tbemployee_profiles.findUnique({
    where: { PK_employee: userId },
    select: {
      PK_employee: true,
      firstName: true,
      lastName: true,
      phone: true,
      ci: true,
      birthDate: true,
      joinedAt: true,
    },
  });
}

export async function updateUserProfile(
  userId: number,
  data: Partial<{
    firstName: string;
    lastName: string;
    phone: string;
    ci: string;
    birthDate: Date;
    joinedAt: Date;
  }>
) {
  return await prisma.tbemployee_profiles.update({
    where: { PK_employee: userId },
    data,
  });
}
