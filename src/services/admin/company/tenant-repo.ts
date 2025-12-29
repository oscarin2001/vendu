import "server-only";
import { prisma } from "../../../lib/prisma";
import { PrismaClient } from "@prisma/client";

type CreateParams = {
  name: string;
  slug: string;
  taxId?: string | null;
  username: string;
  passwordHash: string;
  fullName?: string;
  branch: {
    address: string;
    city: string;
    department?: string | null;
    phone?: string | null;
    name?: string;
  };
};

export async function createCompanyAndOwner(params: CreateParams) {
  const { name, slug, taxId, username, passwordHash, fullName, branch } =
    params;

  return prisma.$transaction(
    async (
      tx: Omit<
        PrismaClient,
        | "$connect"
        | "$disconnect"
        | "$on"
        | "$transaction"
        | "$use"
        | "$extends"
      >
    ) => {
      const company = await tx.tbcompanies.create({
        data: { name, slug, taxId },
      });

      const privilege = await tx.tbprivileges.upsert({
        where: { privilegeCode: "OWNER" },
        update: {},
        create: {
          privilegeName: "Owner",
          privilegeCode: "OWNER",
          description: "Propietario / administrador inicial",
        },
      });

      const auth = await tx.tbauth.create({
        data: {
          FK_company: company.PK_company,
          FK_privilege: privilege.PK_privilege,
          username,
          password: passwordHash,
          accountType: "BOTH",
        },
      });

      const branchRecord = await tx.tbbranches.create({
        data: {
          FK_company: company.PK_company,
          name: branch.name ?? "Sucursal Principal",
          address: branch.address,
          city: branch.city,
          department: branch.department ?? "",
          phone: branch.phone ?? "",
          isWarehouse: false,
        },
      });

      if (fullName) {
        const [firstName, ...rest] = fullName.trim().split(" ");
        await tx.tbemployee_profiles.create({
          data: {
            FK_auth: auth.PK_auth,
            FK_company: company.PK_company,
            FK_branch: branchRecord.PK_branch,
            firstName: firstName || "Owner",
            lastName: rest.join(" "),
            ci: `OWNER-${company.PK_company}`, // Placeholder CI for owner
          },
        });
      }

      return { company, auth, branch: branchRecord };
    }
  );
}

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
