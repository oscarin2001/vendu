"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { normalizeBranchInput } from "./utils/branch-utils";
import { getAuditService } from "@/services/shared/audit";

const createBranchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  phone: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  department: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const updateBranchSchema = createBranchSchema.partial();

type CreateBranchData = z.infer<typeof createBranchSchema>;
type UpdateBranchData = z.infer<typeof updateBranchSchema>;

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

export async function getBranchesByCompany(tenantId: string) {
  const branches = await prisma.tbbranches.findMany({
    where: {
      company: {
        slug: tenantId,
      },
    },
    include: {
      tbemployee_profiles: {
        where: {
          auth: {
            privilege: {
              privilegeCode: "BRANCH_MANAGER",
            },
          },
        },
        include: {
          auth: {
            include: {
              privilege: true,
            },
          },
        },
      },
      createdBy: {
        select: {
          PK_employee: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Obtener información de última actualización desde auditoría
  const auditService = getAuditService(prisma);
  const branchesWithAudit = await Promise.all(
    branches.map(async (branch: any) => {
      const lastUpdate = await auditService.getLastUpdate(
        "BRANCH",
        branch.PK_branch
      );

      return {
        id: branch.PK_branch,
        name: branch.name,
        isWarehouse: branch.isWarehouse,
        phone: branch.phone,
        address: branch.address,
        city: branch.city,
        department: branch.department,
        country: branch.country,
        latitude: branch.latitude,
        longitude: branch.longitude,
        openingHours: branch.openingHours,
        manager: branch.tbemployee_profiles[0]
          ? {
              id: branch.tbemployee_profiles[0].PK_employee,
              name: `${branch.tbemployee_profiles[0].firstName} ${branch.tbemployee_profiles[0].lastName}`,
              email: branch.tbemployee_profiles[0].auth.username,
            }
          : null,
        createdAt: branch.createdAt,
        updatedAt: lastUpdate?.updatedAt || null,
        createdBy: branch.createdBy
          ? {
              id: branch.createdBy.PK_employee,
              name: `${branch.createdBy.firstName} ${branch.createdBy.lastName}`,
            }
          : undefined,
        updatedBy: lastUpdate?.updatedBy || null,
      };
    })
  );

  return branchesWithAudit;
}

export async function createBranch(
  tenantId: string,
  data: CreateBranchData,
  userContext?: UserContext
) {
  const validatedData = createBranchSchema.parse(data);

  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const branch = await prisma.tbbranches.create({
    data: {
      FK_company: company.PK_company,
      name: validatedData.name,
      phone: validatedData.phone,
      address: validatedData.address,
      city: validatedData.city,
      department: validatedData.department,
      country: validatedData.country,
      latitude: validatedData.latitude,
      longitude: validatedData.longitude,
      FK_createdBy: userContext?.employeeId,
    },
  });

  // Registrar auditoría
  const auditService = getAuditService(prisma);
  await auditService.logCreate(
    "BRANCH",
    branch.PK_branch,
    {
      name: validatedData.name,
      isWarehouse: false, // Branches are always stores
      phone: validatedData.phone,
      address: validatedData.address,
      city: validatedData.city,
      department: validatedData.department,
      country: validatedData.country,
      latitude: validatedData.latitude,
      longitude: validatedData.longitude,
    },
    {
      employeeId: userContext?.employeeId,
      companyId: company.PK_company,
      ipAddress: userContext?.ipAddress,
      userAgent: userContext?.userAgent,
    }
  );

  return {
    id: branch.PK_branch,
    name: branch.name,
    phone: branch.phone,
    address: branch.address,
    city: branch.city,
    department: branch.department,
    country: branch.country,
    latitude: branch.latitude,
    longitude: branch.longitude,
    createdAt: branch.createdAt,
  };
}

export async function updateBranch(
  branchId: number,
  data: UpdateBranchData,
  userContext?: UserContext
) {
  const validatedData = updateBranchSchema.parse(data);

  // Obtener valores anteriores para auditoría
  const oldBranch = await prisma.tbbranches.findUnique({
    where: { PK_branch: branchId },
  });

  if (!oldBranch) {
    throw new Error("Branch not found");
  }

  const branch = await prisma.tbbranches.update({
    where: { PK_branch: branchId },
    data: validatedData,
  });

  // Registrar auditoría
  const auditService = getAuditService(prisma);
  await auditService.logUpdate(
    "BRANCH",
    branchId,
    {
      name: oldBranch.name,
      phone: oldBranch.phone,
      address: oldBranch.address,
      city: oldBranch.city,
      department: oldBranch.department,
      country: oldBranch.country,
      latitude: oldBranch.latitude,
      longitude: oldBranch.longitude,
    },
    {
      name: branch.name,
      phone: branch.phone,
      address: branch.address,
      city: branch.city,
      department: branch.department,
      country: branch.country,
      latitude: branch.latitude,
      longitude: branch.longitude,
    },
    {
      employeeId: userContext?.employeeId,
      companyId: oldBranch.FK_company || undefined,
      ipAddress: userContext?.ipAddress,
      userAgent: userContext?.userAgent,
    }
  );

  return {
    id: branch.PK_branch,
    name: branch.name,
    phone: branch.phone,
    address: branch.address,
    city: branch.city,
    department: branch.department,
    country: branch.country,
    latitude: branch.latitude,
    longitude: branch.longitude,
  };
}

export async function deleteBranch(
  branchId: number,
  userContext?: UserContext
) {
  // Obtener valores anteriores para auditoría
  const oldBranch = await prisma.tbbranches.findUnique({
    where: { PK_branch: branchId },
  });

  if (!oldBranch) {
    throw new Error("Branch not found");
  }

  // Verificar que no haya empleados activos en la sucursal
  const employeesCount = await prisma.tbemployee_profiles.count({
    where: {
      FK_branch: branchId,
      deletedAt: null,
    },
  });

  if (employeesCount > 0) {
    throw new Error("Cannot delete branch with active employees");
  }

  await prisma.tbbranches.delete({
    where: { PK_branch: branchId },
  });

  // Registrar auditoría
  const auditService = getAuditService(prisma);
  await auditService.logDelete(
    "BRANCH",
    branchId,
    {
      name: oldBranch.name,
      phone: oldBranch.phone,
      address: oldBranch.address,
      city: oldBranch.city,
      department: oldBranch.department,
      country: oldBranch.country,
      latitude: oldBranch.latitude,
      longitude: oldBranch.longitude,
    },
    {
      employeeId: userContext?.employeeId,
      companyId: oldBranch.FK_company || undefined,
      ipAddress: userContext?.ipAddress,
      userAgent: userContext?.userAgent,
    }
  );

  return { success: true };
}

export async function assignManagerToBranch(
  branchId: number,
  employeeId: number
) {
  // Verificar que el empleado existe y es un manager
  const employee = await prisma.tbemployee_profiles.findUnique({
    where: { PK_employee: employeeId },
    include: {
      auth: {
        include: {
          privilege: true,
        },
      },
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  // Verificar que es un manager
  const isManager = employee.auth.privilege.privilegeCode === "BRANCH_MANAGER";
  if (!isManager) {
    throw new Error("Employee is not a manager");
  }

  // Verificar que no esté ya asignado a esta sucursal
  const existingAssignment = await prisma.tbmanager_branches.findUnique({
    where: {
      FK_manager_FK_branch: {
        FK_manager: employeeId,
        FK_branch: branchId,
      },
    },
  });

  if (existingAssignment) {
    throw new Error("Manager is already assigned to this branch");
  }

  // Crear la asignación en la tabla intermedia
  await prisma.tbmanager_branches.create({
    data: {
      FK_manager: employeeId,
      FK_branch: branchId,
    },
  });

  return { success: true };
}
