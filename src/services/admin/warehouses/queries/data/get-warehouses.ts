"use server";

import { prisma } from "@/lib/prisma";

/**
 * Get all warehouses for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @returns Array of warehouses with managers and branches
 */
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
      createdBy: {
        select: {
          PK_employee: true,
          firstName: true,
          lastName: true,
        },
      },
      updatedBy: {
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

  return warehouses.map((warehouse: any) => ({
    id: warehouse.PK_warehouse,
    name: warehouse.name,
    phone: warehouse.phone ?? undefined,
    address: warehouse.address,
    city: warehouse.city,
    department: warehouse.department ?? undefined,
    country: warehouse.country ?? undefined,
    openedAt: warehouse.openedAt ?? undefined, // Fecha de apertura de la bodega
    managers: warehouse.managerWarehouses.map((mw: any) => ({
      id: mw.manager.PK_employee,
      name: `${mw.manager.firstName} ${mw.manager.lastName}`,
      email: mw.manager.auth?.username,
    })),
    branches: warehouse.warehouseBranches.map((wb: any) => ({
      id: wb.branch.PK_branch,
      name: wb.branch.name,
      address: wb.branch.address,
      isPrimary: wb.isPrimary,
    })),
    createdAt: warehouse.createdAt,
    updatedAt: warehouse.updatedAt || undefined,
    createdBy: warehouse.createdBy
      ? {
          id: warehouse.createdBy.PK_employee,
          name: `${warehouse.createdBy.firstName} ${warehouse.createdBy.lastName}`,
        }
      : undefined,
    updatedBy: warehouse.updatedBy
      ? {
          id: warehouse.updatedBy.PK_employee,
          name: `${warehouse.updatedBy.firstName} ${warehouse.updatedBy.lastName}`,
        }
      : undefined,
  }));
}

/**
 * Get a specific warehouse by ID for a company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @param warehouseId - The warehouse ID
 * @returns Warehouse details or null if not found
 */
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
      createdBy: {
        select: {
          PK_employee: true,
          firstName: true,
          lastName: true,
        },
      },
      updatedBy: {
        select: {
          PK_employee: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!warehouse) {
    return null;
  }

  return {
    id: warehouse.PK_warehouse,
    name: warehouse.name,
    phone: warehouse.phone ?? undefined,
    address: warehouse.address,
    city: warehouse.city,
    department: warehouse.department ?? undefined,
    country: warehouse.country ?? undefined,
    managers: warehouse.managerWarehouses.map((mw: any) => ({
      id: mw.manager.PK_employee,
      name: `${mw.manager.firstName} ${mw.manager.lastName}`,
      email: mw.manager.auth?.username,
      role: mw.manager.auth?.privilege?.privilegeCode,
    })),
    branches: warehouse.warehouseBranches.map((wb: any) => ({
      id: wb.branch.PK_branch,
      name: wb.branch.name,
      address: wb.branch.address,
      isPrimary: wb.isPrimary,
    })),
    createdAt: warehouse.createdAt,
    updatedAt: warehouse.updatedAt || undefined,
    createdBy: warehouse.createdBy
      ? {
          id: warehouse.createdBy.PK_employee,
          name: `${warehouse.createdBy.firstName} ${warehouse.createdBy.lastName}`,
        }
      : undefined,
    updatedBy: warehouse.updatedBy
      ? {
          id: warehouse.updatedBy.PK_employee,
          name: `${warehouse.updatedBy.firstName} ${warehouse.updatedBy.lastName}`,
        }
      : undefined,
  };
}
