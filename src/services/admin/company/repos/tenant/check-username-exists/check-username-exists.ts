import { prisma } from "@/lib/prisma";

export async function checkUsernameExists(username: string): Promise<boolean> {
  if (!username || username.trim() === "") {
    return false;
  }

  const trimmedUsername = username.trim().toLowerCase();

  // Validar que sea un email válido antes de buscar
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmedUsername)) {
    return false; // No es un email válido, no puede existir
  }

  try {
    const existing = await prisma.tbauth.findFirst({
      where: {
        username: trimmedUsername,
      },
    });

    return !!existing;
  } catch (error) {
    console.error("Error checking username exists:", error);
    return false;
  }
}
