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

/**
 * Obtiene el perfil del empleado junto con los datos de autenticación (username)
 * basándose en el FK_auth del perfil del empleado
 */
export async function getUserAccountProfile(userId: number) {
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
      auth: {
        select: {
          PK_auth: true,
          username: true,
          lastLogin: true,
          createdAt: true,
        },
      },
    },
  });
}

/**
 * Obtiene el perfil del usuario directamente desde tbauth por su PK_auth (userId de la sesión)
 */
export async function getUserAccountByAuthId(authId: number) {
  return await prisma.tbauth.findUnique({
    where: { PK_auth: authId },
    select: {
      PK_auth: true,
      username: true,
      lastLogin: true,
      createdAt: true,
      employeeProfile: {
        select: {
          PK_employee: true,
          firstName: true,
          lastName: true,
          phone: true,
          ci: true,
          birthDate: true,
          joinedAt: true,
        },
      },
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
