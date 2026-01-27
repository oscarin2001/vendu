"use client";

import { AuditInfoCard } from "@/components/admin/shared/audit";
import { Branch } from "@/services/admin/branches";

interface BranchAuditSectionProps {
  branch: Branch;
}

/**
 * Sección de auditoría para el modal de detalles de sucursal
 * Utiliza el componente compartido AuditInfoCard
 */
export function BranchAuditSection({ branch }: BranchAuditSectionProps) {
  return (
    <AuditInfoCard
      entityId={branch.id}
      createdAt={branch.createdAt}
      createdByName={branch.createdBy?.name}
      updatedAt={branch.updatedAt}
      updatedByName={branch.updatedBy?.name}
      openedAt={branch.openedAt}
      openedAtLabel="Fecha de Apertura"
    />
  );
}
