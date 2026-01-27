"use client";

import { AuditInfoCard } from "@/components/admin/shared/audit";
import { Supplier } from "@/services/admin/suppliers";

interface SupplierAuditSectionProps {
  supplier: Supplier;
}

/**
 * Sección de auditoría para el modal de detalles de proveedor
 * Utiliza el componente compartido AuditInfoCard
 */
export function SupplierAuditSection({ supplier }: SupplierAuditSectionProps) {
  return (
    <AuditInfoCard
      entityId={supplier.id}
      createdAt={supplier.createdAt}
      createdByName={supplier.createdBy?.name}
      updatedAt={supplier.updatedAt}
      updatedByName={supplier.updatedBy?.name}
      openedAt={supplier.partnerSince}
      openedAtLabel="Socio Desde"
      title="Información del Sistema"
    />
  );
}
