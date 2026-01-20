"use server";

import { prisma } from "@/lib/prisma";
import { getAuditService } from "@/services/shared/audit";
import { validateAdminPassword } from "@/services/admin/managers";
import { CreateBranchData } from "../../../validations/types/inferred.types";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Create a new branch for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @param data - Branch creation data
 * @param context - User context for auditing
 * @returns Created branch information
 */
export async function createBranch(
  tenantId: string,
  data: CreateBranchData,
  context?: UserContext,
) {
  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const branch = await prisma.tbbranches.create({
    data: {
      FK_company: company.PK_company,
      name: data.name,
      phone: data.phone,
      address: data.address,
      city: data.city,
      department: data.department,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      openedAt: data.openedAt, // Fecha de apertura de la sucursal
      FK_createdBy: context?.employeeId,
    },
  });

  // Registrar auditoría
  const auditService = getAuditService(prisma);
  await auditService.logCreate(
    "BRANCH",
    branch.PK_branch,
    {
      name: data.name,
      isWarehouse: false, // Branches are always stores
      phone: data.phone,
      address: data.address,
      city: data.city,
      department: data.department,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
    },
    {
      employeeId: context?.employeeId,
      companyId: company.PK_company,
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent,
    },
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
