"use client";

import { Badge } from "@/components/ui/badge";

interface ServiceSummaryProps {
  assignedCount: number;
  totalCount: number;
}

export function ServiceSummary({
  assignedCount,
  totalCount,
}: ServiceSummaryProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Resumen de Servicio</h3>
          <p className="text-sm text-gray-600">
            {assignedCount} de {totalCount} bodegas asignadas
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {assignedCount} activas
        </Badge>
      </div>
    </div>
  );
}
