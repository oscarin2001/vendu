"use server";

import { prisma } from "@/lib/prisma";
import { getAuditService } from "@/services/shared/audit";
import { updateSupplier } from "../../../repos/suppliers";
import { updateSupplierSchema } from "../../../validations/schemas/supplier-schemas";
import { validateAdminPassword } from "@/services/admin/managers";

interface UserContext {
  employeeId?: number;
}

/**
 * Update an existing supplier
 * @param supplierId - The supplier ID to update
 * @param data - Supplier update data
 * @param context - User context for auditing
 * @returns Updated supplier information
 * @throws Error if validation fails or supplier not found
 */
export async function updateSupplierService(
  supplierId: number,
  data: any,
  context?: UserContext,
) {
  const maybeData: any = { ...(data as any) };

  // extract admin confirm password and change reason if present
  const confirmPassword: string | undefined = maybeData._confirmPassword;
  if (maybeData._confirmPassword) delete maybeData._confirmPassword;
  const changeReason: string | undefined = maybeData._changeReason;
  if (maybeData._changeReason) delete maybeData._changeReason;

  // If confirm password provided, resolve supplier company slug and validate
  if (confirmPassword) {
    const supplierRecord = await prisma.tbsuppliers.findUnique({
      where: { PK_supplier: supplierId },
      select: { FK_company: true },
    });
    if (!supplierRecord || !supplierRecord.FK_company) {
      throw new Error("Supplier or company not found");
    }
    const company = await prisma.tbcompanies.findUnique({
      where: { PK_company: supplierRecord.FK_company },
      select: { slug: true },
    });
    if (!company) throw new Error("Company not found");

    try {
      await validateAdminPassword({ tenantId: company.slug, employeeId: context?.employeeId, password: confirmPassword });
    } catch (err: any) {
      const e = new Error(err?.message || "La contraseña no coincide");
      e.name = "ValidationError";
      throw e;
    }
  }

  // fetch old supplier values for audit
  const oldSupplier = await prisma.tbsuppliers.findUnique({
    where: { PK_supplier: supplierId },
  });

  const validatedData = updateSupplierSchema.parse(maybeData);

  const supplier = await updateSupplier(supplierId, {
    ...(validatedData.firstName && { firstName: validatedData.firstName }),
    ...(validatedData.lastName && { lastName: validatedData.lastName }),
    ...(validatedData.ci !== undefined && { ci: validatedData.ci }),
    ...(validatedData.phone !== undefined && {
      phone: validatedData.phone,
    }),
    ...(validatedData.email !== undefined && {
      email: validatedData.email,
    }),
    ...(validatedData.address !== undefined && {
      address: validatedData.address,
    }),
    ...(validatedData.city !== undefined && { city: validatedData.city }),
    ...(validatedData.department !== undefined && {
      department: validatedData.department,
    }),
    ...(validatedData.country !== undefined && {
      country: validatedData.country,
    }),
    ...(validatedData.notes !== undefined && {
      notes: validatedData.notes,
    }),
    ...(validatedData.birthDate !== undefined && {
      birthDate: validatedData.birthDate,
    }),
    ...(validatedData.partnerSince !== undefined && {
      partnerSince: validatedData.partnerSince,
    }),
    ...(validatedData.contractEndAt !== undefined && {
      contractEndAt: validatedData.contractEndAt,
    }),
    ...(validatedData.isIndefinite !== undefined && {
      isIndefinite: validatedData.isIndefinite,
    }),
    ...(validatedData.isActive !== undefined && {
      isActive: validatedData.isActive,
    }),
    FK_updatedBy: context?.employeeId,
  });

  // Audit: log update with change reason if provided
  try {
    const auditService = getAuditService(prisma);
    const oldValue = {
      firstName: oldSupplier?.firstName,
      lastName: oldSupplier?.lastName,
      ci: (oldSupplier as any)?.ci,
      phone: oldSupplier?.phone,
      email: oldSupplier?.email,
      address: oldSupplier?.address,
      city: oldSupplier?.city,
      department: oldSupplier?.department,
      country: oldSupplier?.country,
    };

    const newValue: Record<string, any> = {
      firstName: supplier.firstName,
      lastName: supplier.lastName,
      ci: (supplier as any).ci,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      city: supplier.city,
      department: supplier.department,
      country: supplier.country,
    };

    if (changeReason) {
      newValue._changeReason = changeReason;
      newValue._changedAt = new Date().toISOString();
    }

    await auditService.logUpdate(
      "SUPPLIER",
      supplierId,
      oldValue,
      newValue,
      { employeeId: context?.employeeId },
    );
  } catch (err) {
    console.error("Supplier audit log error:", err);
  }

  return {
    id: supplier.PK_supplier,
    ci: (supplier as any).ci,
    firstName: supplier.firstName,
    lastName: supplier.lastName,
    fullName: `${supplier.firstName} ${supplier.lastName}`,
    phone: supplier.phone,
    email: supplier.email,
    address: supplier.address,
    city: supplier.city,
    department: supplier.department,
    country: supplier.country,
    notes: supplier.notes,
    birthDate: supplier.birthDate,
    partnerSince: supplier.partnerSince,
    isActive: supplier.isActive,
    createdAt: supplier.createdAt,
    updatedAt: supplier.updatedAt,
  };
}
