"use client";

import { Calendar, Clock, User, Store } from "lucide-react";
import { Branch } from "@/services/admin/branches";

interface BranchAuditSectionProps {
  branch: Branch;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const formatDateShort = (date: Date) => {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

export function BranchAuditSection({ branch }: BranchAuditSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <h4 className="font-semibold text-base">Información de Auditoría</h4>
      </div>

      <div className="grid gap-4 md:grid-cols-3 pl-7">
        {/* Fecha de Apertura */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-orange-700">
            Fecha de Apertura
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Store className="h-4 w-4" />
            {branch.openedAt
              ? formatDateShort(branch.openedAt)
              : "No especificada"}
          </div>
          {branch.openedAt && (
            <p className="text-xs text-muted-foreground">
              Desde cuándo opera esta sucursal
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-green-700">
            Fecha de Creación
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatDate(branch.createdAt)}
          </div>
          {branch.createdBy && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              Creado por: {branch.createdBy.name}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-blue-700">
            Última Actualización
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {branch.updatedAt
              ? formatDate(branch.updatedAt)
              : "Nunca actualizada"}
          </div>
          {branch.updatedBy && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              Actualizado por: {branch.updatedBy.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
