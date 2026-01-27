"use client";

import { AuditInfoCard } from "@/components/admin/shared/audit";
import { Manager } from "@/services/admin/managers";

interface ManagerAuditSectionProps {
  manager: Manager;
}

/**
 * Sección de auditoría para el modal de detalles de encargado
 * Utiliza el componente compartido AuditInfoCard
 */
export function ManagerAuditSection({ manager }: ManagerAuditSectionProps) {
  return (
    <AuditInfoCard
      entityId={manager.id}
      createdAt={manager.createdAt}
      createdByName={manager.createdBy?.name}
      updatedAt={manager.updatedAt}
      updatedByName={manager.updatedBy?.name}
      title="Información del Sistema"
    />
  );
}
