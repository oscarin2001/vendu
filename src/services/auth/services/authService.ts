import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";

export interface CreateUserPayload {
  username: string;
  password: string;
  email?: string;
}

export async function findUserByUsername(username: string) {
  return prisma.tbauth.findUnique({ where: { username } });
}

export async function verifyCredentials(username: string, password: string) {
  const user = await prisma.tbauth.findUnique({
    where: { username },
    include: { company: true, privilege: true },
  });
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  if (!user.isActive) throw new Error("Cuenta inactiva");
  return user;
}

export async function createUser(payload: CreateUserPayload) {
  const { username, password, email } = payload;

  // Basic password strength check
  if (password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres");
  }

  // Check existing
  const existing = await findUserByUsername(username);
  if (existing) {
    throw new Error("Usuario ya existente");
  }

  const hashed = await bcrypt.hash(password, 10);

  const createData: any = {
    username,
    password: hashed,
    isActive: true,
  };

  // Ensure we set a valid privilege FK (required by schema)
  let privilege = await prisma.tbprivileges.findFirst({
    where: { privilegeCode: "CUSTOMER" },
  });
  if (!privilege) {
    // Fallback: use any existing privilege or create a default Customer privilege
    privilege = await prisma.tbprivileges.findFirst();
    if (!privilege) {
      privilege = await prisma.tbprivileges.create({
        data: {
          privilegeName: "Cliente",
          privilegeCode: "CUSTOMER",
        },
      });
    }
  }

  createData.FK_privilege = privilege.PK_privilege;

  // Create the auth record (do NOT pass `email` here; it doesn't exist on tbauth model)
  const user = await prisma.tbauth.create({ data: createData });

  // If email provided, create or link a customer profile
  if (email) {
    // Check if there's already a profile with this email
    const existingProfile = await prisma.tbcustomer_profiles.findUnique({
      where: { email },
    });

    if (existingProfile) {
      // If the profile is already linked to another auth account, roll back
      if (existingProfile.FK_auth && existingProfile.FK_auth !== user.PK_auth) {
        // Clean up created user to avoid orphan auth entry
        await prisma.tbauth.delete({ where: { PK_auth: user.PK_auth } });
        throw new Error("El email ya está registrado en otra cuenta");
      }

      // Link profile to the new user if unlinked
      if (!existingProfile.FK_auth) {
        await prisma.tbcustomer_profiles.update({
          where: { PK_customer: existingProfile.PK_customer },
          data: { FK_auth: user.PK_auth, isGuest: false },
        });
      }
    } else {
      // Create a new customer profile linked to auth
      await prisma.tbcustomer_profiles.create({
        data: {
          FK_auth: user.PK_auth,
          email,
          firstName: "",
          lastName: "",
          isGuest: false,
        },
      });
    }
  }

  return user;
}
