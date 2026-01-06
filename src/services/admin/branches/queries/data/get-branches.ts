"use server";

import { prisma } from "@/lib/prisma";
import { getAuditService } from "@/services/shared/audit";

/**
 * Get all branches for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @returns Array of branches with manager and supplier information
 */
export async function getBranchesByCompany(tenantId: string) {
  const branches = await prisma.tbbranches.findMany({
    where: {
      company: {
        slug: tenantId,
      },
    },
    include: {
      managerBranches: {
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
          warehouse: true,
        },
      },
      supplierBranches: {
        include: {
          supplier: true,
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
        manager: branch.managerBranches[0]
          ? {
              id: branch.managerBranches[0].manager.PK_employee,
              name: `${branch.managerBranches[0].manager.firstName} ${branch.managerBranches[0].manager.lastName}`,
              email: branch.managerBranches[0].manager.auth.username,
            }
          : null,
        managers: branch.managerBranches.map((mb: any) => ({
          id: mb.manager.PK_employee,
          name: `${mb.manager.firstName} ${mb.manager.lastName}`,
          email: mb.manager.auth.username,
        })),
        warehouses: branch.warehouseBranches.map((wb: any) => ({
          id: wb.warehouse.PK_warehouse,
          name: wb.warehouse.name,
          address: wb.warehouse.address,
          isPrimary: wb.isPrimary,
        })),
        suppliers: branch.supplierBranches.map((sb: any) => ({
          id: sb.supplier.PK_supplier,
          name: sb.supplier.name,
          email: sb.supplier.email,
        })),
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

/**
 * Get branch audit logs
 * @param branchId - The branch ID
 * @param companyId - Optional company ID for filtering
 * @returns Audit logs for the branch
 */
export async function getBranchAuditLogs(branchId: number, companyId?: number) {
  const auditService = getAuditService(prisma);

  return await auditService.getAuditLogs({
    entityType: "BRANCH",
    entityId: branchId,
    companyId,
  });
}
