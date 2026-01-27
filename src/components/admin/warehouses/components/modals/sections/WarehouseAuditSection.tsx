"use client";

import { AuditInfoCard } from "@/components/admin/shared/audit";
import { Warehouse } from "@/services/admin/warehouses/types/warehouse.types";

interface WarehouseAuditSectionProps {
  warehouse: Warehouse;
}

/**
 * Sección de auditoría para el modal de detalles de bodega
 * Utiliza el componente compartido AuditInfoCard
 */
export function WarehouseAuditSection({
  warehouse,
}: WarehouseAuditSectionProps) {
  return (
    <AuditInfoCard
      entityId={warehouse.id}
      createdAt={warehouse.createdAt}
      createdByName={warehouse.createdBy?.name}
      updatedAt={warehouse.updatedAt}
      updatedByName={warehouse.updatedBy?.name}
      openedAt={warehouse.openedAt}
      openedAtLabel="Fecha de Apertura"
      title="Información del Sistema"
    />
  );
}
