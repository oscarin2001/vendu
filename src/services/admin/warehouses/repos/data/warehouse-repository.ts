"use server";

import { prisma } from "@/lib/prisma";
import type {
  Warehouse,
  WarehouseWithRelations,
} from "../../types/entities/warehouse";

/**
 * Find a company by slug
 * @param slug - Company slug/tenant identifier
 * @returns Company record or null
 */
export async function findCompanyBySlug(slug: string) {
  return await prisma.tbcompanies.findUnique({
    where: { slug },
  });
}

/**
 * Find a warehouse by ID and company
 * @param warehouseId - Warehouse ID
 * @param companyId - Company ID
 * @returns Warehouse record or null
 */
export async function findWarehouseByIdAndCompany(
  warehouseId: number,
  companyId: number
) {
  return await prisma.tbwarehouses.findFirst({
    where: {
      PK_warehouse: warehouseId,
      FK_company: companyId,
    },
  });
}

/**
 * Find all warehouses for a company
 * @param companyId - Company ID
 * @returns Array of warehouse records
 */
export async function findWarehousesByCompany(companyId: number) {
  return await prisma.tbwarehouses.findMany({
    where: { FK_company: companyId },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * Find warehouse with relations by ID and company
 * @param warehouseId - Warehouse ID
 * @param companyId - Company ID
 * @returns Warehouse with relations or null
 */
export async function findWarehouseWithRelationsByIdAndCompany(
  warehouseId: number,
  companyId: number
) {
  return await prisma.tbwarehouses.findFirst({
    where: {
      PK_warehouse: warehouseId,
      FK_company: companyId,
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
}

/**
 * Find warehouses with relations by company
 * @param companyId - Company ID
 * @returns Array of warehouses with relations
 */
export async function findWarehousesWithRelationsByCompany(companyId: number) {
  return await prisma.tbwarehouses.findMany({
    where: { FK_company: companyId },
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
    orderBy: { createdAt: "asc" },
  });
}
