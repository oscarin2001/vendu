"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { normalizeWarehouseInput } from "./utils/warehouse-utils";
import { getAuditService } from "@/services/shared/audit";

const createWarehouseSchema = z.object({
  name: z.string().min(1, "Warehouse name is required"),
  phone: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  department: z.string().optional(),
  country: z.string().optional(),
});

const updateWarehouseSchema = createWarehouseSchema.partial();

type CreateWarehouseData = z.infer<typeof createWarehouseSchema>;
type UpdateWarehouseData = z.infer<typeof updateWarehouseSchema>;

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

export async function getWarehousesByCompany(tenantId: string) {
  const warehouses = await prisma.tbwarehouses.findMany({
    where: {
      company: {
        slug: tenantId,
      },
    },
    include: {
      managerWarehouses: {
        include: {
          manager: {
            include: {
              auth: {
                include: {
                  privilege: true,
                },
              },
            },
          },
        },
      },
      warehouseBranches: {
        include: {
          branch: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return warehouses.map((warehouse: any) => ({
    id: warehouse.PK_warehouse,
    name: warehouse.name,
    phone: warehouse.phone,
    address: warehouse.address,
    city: warehouse.city,
    department: warehouse.department,
    country: warehouse.country,
    managers: warehouse.managerWarehouses.map((mw: any) => ({
      id: mw.manager.PK_employee,
      name: `${mw.manager.firstName} ${mw.manager.lastName}`,
      email: mw.manager.auth?.username,
    })),
    branches: warehouse.warehouseBranches.map((wb: any) => ({
      id: wb.branch.PK_branch,
      name: wb.branch.name,
      isPrimary: wb.isPrimary,
    })),
    createdAt: warehouse.createdAt,
    updatedAt: warehouse.updatedAt || undefined,
  }));
}

export async function getWarehouseById(tenantId: string, warehouseId: number) {
  const warehouse = await prisma.tbwarehouses.findFirst({
    where: {
      PK_warehouse: warehouseId,
      company: {
        slug: tenantId,
      },
    },
    include: {
      managerWarehouses: {
        include: {
          manager: {
            include: {
              auth: {
                include: {
                  privilege: true,
                },
              },
            },
          },
        },
      },
      warehouseBranches: {
        include: {
          branch: true,
        },
      },
    },
  });

  if (!warehouse) return null;

  return {
    id: warehouse.PK_warehouse,
    name: warehouse.name,
    phone: warehouse.phone,
    address: warehouse.address,
    city: warehouse.city,
    department: warehouse.department,
    country: warehouse.country,
    managers: warehouse.managerWarehouses.map((mw: any) => ({
      id: mw.manager.PK_employee,
      name: `${mw.manager.firstName} ${mw.manager.lastName}`,
      email: mw.manager.auth?.username,
    })),
    branches: warehouse.warehouseBranches.map((wb: any) => ({
      id: wb.branch.PK_branch,
      name: wb.branch.name,
      isPrimary: wb.isPrimary,
    })),
    createdAt: warehouse.createdAt,
    updatedAt: warehouse.updatedAt || undefined,
  };
}

export async function createWarehouse(
  tenantId: string,
  data: CreateWarehouseData,
  context?: UserContext
) {
  const validatedData = createWarehouseSchema.parse(data);

  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const normalizedData = normalizeWarehouseInput(validatedData);

  const warehouse = await prisma.tbwarehouses.create({
    data: {
      FK_company: company.PK_company,
      name: normalizedData.name!,
      phone: normalizedData.phone,
      address: normalizedData.address,
      city: normalizedData.city,
      department: normalizedData.department,
      country: validatedData.country,
      FK_createdBy: context?.employeeId,
    },
  });

  // Audit log
  if (context?.employeeId) {
    await getAuditService().log({
      entity: "WAREHOUSE",
      entityId: warehouse.PK_warehouse,
      action: "CREATE",
      oldValue: null,
      newValue: {
        name: warehouse.name,
        address: warehouse.address,
        city: warehouse.city,
      },
      employeeId: context.employeeId,
      companyId: company.PK_company,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });
  }

  return {
    id: warehouse.PK_warehouse,
    name: warehouse.name,
    phone: warehouse.phone,
    address: warehouse.address,
    city: warehouse.city,
    department: warehouse.department,
    country: warehouse.country,
    createdAt: warehouse.createdAt,
    updatedAt: warehouse.updatedAt || undefined,
  };
}

export async function updateWarehouse(
  tenantId: string,
  warehouseId: number,
  data: UpdateWarehouseData,
  context?: UserContext
) {
  const validatedData = updateWarehouseSchema.parse(data);

  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const existingWarehouse = await prisma.tbwarehouses.findFirst({
    where: {
      PK_warehouse: warehouseId,
      FK_company: company.PK_company,
    },
  });

  if (!existingWarehouse) {
    throw new Error("Warehouse not found");
  }

  const normalizedData = normalizeWarehouseInput(validatedData);

  const warehouse = await prisma.tbwarehouses.update({
    where: { PK_warehouse: warehouseId },
    data: {
      name: normalizedData.name,
      phone: normalizedData.phone,
      address: normalizedData.address,
      city: normalizedData.city,
      department: normalizedData.department,
      country: validatedData.country,
      FK_updatedBy: context?.employeeId,
    },
  });

  // Audit log
  if (context?.employeeId) {
    await getAuditService().log({
      entity: "WAREHOUSE",
      entityId: warehouse.PK_warehouse,
      action: "UPDATE",
      oldValue: {
        name: existingWarehouse.name,
        address: existingWarehouse.address,
        city: existingWarehouse.city,
      },
      newValue: {
        name: warehouse.name,
        address: warehouse.address,
        city: warehouse.city,
      },
      employeeId: context.employeeId,
      companyId: company.PK_company,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });
  }

  return {
    id: warehouse.PK_warehouse,
    name: warehouse.name,
    phone: warehouse.phone,
    address: warehouse.address,
    city: warehouse.city,
    department: warehouse.department,
    country: warehouse.country,
    createdAt: warehouse.createdAt,
    updatedAt: warehouse.updatedAt || undefined,
  };
}

export async function deleteWarehouse(
  tenantId: string,
  warehouseId: number,
  context?: UserContext
) {
  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const existingWarehouse = await prisma.tbwarehouses.findFirst({
    where: {
      PK_warehouse: warehouseId,
      FK_company: company.PK_company,
    },
  });

  if (!existingWarehouse) {
    throw new Error("Warehouse not found");
  }

  // Check if warehouse has any assignments
  const managerAssignments = await prisma.tbmanager_warehouses.count({
    where: { FK_warehouse: warehouseId },
  });

  const branchAssignments = await prisma.tbwarehouse_branches.count({
    where: { FK_warehouse: warehouseId },
  });

  if (managerAssignments > 0 || branchAssignments > 0) {
    throw new Error("Cannot delete warehouse with active assignments. Remove all manager and branch assignments first.");
  }

  await prisma.tbwarehouses.delete({
    where: { PK_warehouse: warehouseId },
  });

  // Audit log
  if (context?.employeeId) {
    await getAuditService().log({
      entity: "WAREHOUSE",
      entityId: warehouseId,
      action: "DELETE",
      oldValue: {
        name: existingWarehouse.name,
        address: existingWarehouse.address,
        city: existingWarehouse.city,
      },
      newValue: null,
      employeeId: context.employeeId,
      companyId: company.PK_company,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });
  }

  return { success: true };
}

// Manager assignment functions
export async function assignManagerToWarehouse(
  tenantId: string,
  warehouseId: number,
  managerId: number,
  context?: UserContext
) {
  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // Verify warehouse belongs to company
  const warehouse = await prisma.tbwarehouses.findFirst({
    where: {
      PK_warehouse: warehouseId,
      FK_company: company.PK_company,
    },
  });

  if (!warehouse) {
    throw new Error("Warehouse not found");
  }

  // Verify manager belongs to company
  const manager = await prisma.tbemployee_profiles.findFirst({
    where: {
      PK_employee: managerId,
      FK_company: company.PK_company,
    },
  });

  if (!manager) {
    throw new Error("Manager not found");
  }

  // Check if already assigned
  const existing = await prisma.tbmanager_warehouses.findUnique({
    where: {
      FK_employee_FK_warehouse: {
        FK_employee: managerId,
        FK_warehouse: warehouseId,
      },
    },
  });

  if (existing) {
    throw new Error("Manager is already assigned to this warehouse");
  }

  const assignment = await prisma.tbmanager_warehouses.create({
    data: {
      FK_employee: managerId,
      FK_warehouse: warehouseId,
      FK_assignedBy: context?.employeeId,
    },
  });

  return {
    id: assignment.PK_manager_warehouse,
    warehouseId: assignment.FK_warehouse,
    managerId: assignment.FK_employee,
    assignedAt: assignment.assignedAt,
  };
}

export async function removeManagerFromWarehouse(
  tenantId: string,
  warehouseId: number,
  managerId: number,
  context?: UserContext
) {
  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const assignment = await prisma.tbmanager_warehouses.findFirst({
    where: {
      FK_employee: managerId,
      FK_warehouse: warehouseId,
      manager: {
        FK_company: company.PK_company,
      },
      warehouse: {
        FK_company: company.PK_company,
      },
    },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  await prisma.tbmanager_warehouses.delete({
    where: { PK_manager_warehouse: assignment.PK_manager_warehouse },
  });

  return { success: true };
}

// Branch assignment functions
export async function assignWarehouseToBranch(
  tenantId: string,
  warehouseId: number,
  branchId: number,
  isPrimary: boolean = false,
  context?: UserContext
) {
  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // Verify warehouse and branch belong to company
  const [warehouse, branch] = await Promise.all([
    prisma.tbwarehouses.findFirst({
      where: {
        PK_warehouse: warehouseId,
        FK_company: company.PK_company,
      },
    }),
    prisma.tbbranches.findFirst({
      where: {
        PK_branch: branchId,
        FK_company: company.PK_company,
      },
    }),
  ]);

  if (!warehouse) {
    throw new Error("Warehouse not found");
  }

  if (!branch) {
    throw new Error("Branch not found");
  }

  // Check if already assigned
  const existing = await prisma.tbwarehouse_branches.findUnique({
    where: {
      FK_warehouse_FK_branch: {
        FK_warehouse: warehouseId,
        FK_branch: branchId,
      },
    },
  });

  if (existing) {
    throw new Error("Warehouse is already assigned to this branch");
  }

  // If setting as primary, remove other primary assignments for this branch
  if (isPrimary) {
    await prisma.tbwarehouse_branches.updateMany({
      where: { FK_branch: branchId },
      data: { isPrimary: false },
    });
  }

  const assignment = await prisma.tbwarehouse_branches.create({
    data: {
      FK_warehouse: warehouseId,
      FK_branch: branchId,
      isPrimary,
      FK_assignedBy: context?.employeeId,
    },
  });

  return {
    id: assignment.PK_warehouse_branch,
    warehouseId: assignment.FK_warehouse,
    branchId: assignment.FK_branch,
    isPrimary: assignment.isPrimary,
    assignedAt: assignment.assignedAt,
  };
}

export async function removeWarehouseFromBranch(
  tenantId: string,
  warehouseId: number,
  branchId: number,
  context?: UserContext
) {
  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const assignment = await prisma.tbwarehouse_branches.findFirst({
    where: {
      FK_warehouse: warehouseId,
      FK_branch: branchId,
      warehouse: {
        FK_company: company.PK_company,
      },
      branch: {
        FK_company: company.PK_company,
      },
    },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  await prisma.tbwarehouse_branches.delete({
    where: { PK_warehouse_branch: assignment.PK_warehouse_branch },
  });

  return { success: true };
}
