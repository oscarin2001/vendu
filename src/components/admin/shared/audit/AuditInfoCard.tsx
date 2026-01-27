"use client";

import { Calendar, Clock, User, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Props para el componente de tarjeta de auditoría
 * Todos los campos son opcionales para máxima flexibilidad
 */
export interface AuditInfoCardProps {
  /** ID de la entidad */
  entityId?: number | string;
  /** Fecha de creación */
  createdAt?: Date | string | null;
  /** Nombre del usuario que creó */
  createdByName?: string | null;
  /** Fecha de última actualización */
  updatedAt?: Date | string | null;
  /** Nombre del usuario que actualizó */
  updatedByName?: string | null;
  /** Fecha de apertura (para entidades como sucursales/bodegas) */
  openedAt?: Date | string | null;
  /** Etiqueta personalizada para openedAt */
  openedAtLabel?: string;
  /** Título de la sección (default: "Información de Auditoría") */
  title?: string;
  /** Mostrar como Card (true) o div simple (false) */
  asCard?: boolean;
  /** Clases adicionales */
  className?: string;
}

/**
 * Formatea una fecha a formato legible español con hora
 */
const formatDateTime = (date: Date | string): string => {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

/**
 * Formatea una fecha a formato legible español sin hora
 */
const formatDateOnly = (date: Date | string): string => {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
};

/**
 * Componente reutilizable para mostrar información de auditoría
 * Usado en modales de detalle de Branches, Warehouses, Managers, Suppliers
 */
export function AuditInfoCard({
  entityId,
  createdAt,
  createdByName,
  updatedAt,
  updatedByName,
  openedAt,
  openedAtLabel = "Fecha de Apertura",
  title = "Información de Auditoría",
  asCard = false,
  className = "",
}: AuditInfoCardProps) {
  const content = (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Fecha de Apertura (opcional) */}
      {openedAt !== undefined && (
        <AuditInfoItem
          label={openedAtLabel}
          value={openedAt ? formatDateOnly(openedAt) : "No especificada"}
          icon={<Calendar className="h-4 w-4" />}
          colorClass="text-orange-700"
          subtitle={openedAt ? "Desde cuándo opera" : undefined}
        />
      )}

      {/* Fecha de Creación */}
      <AuditInfoItem
        label="Fecha de Creación"
        value={createdAt ? formatDateTime(createdAt) : "No disponible"}
        icon={<Calendar className="h-4 w-4" />}
        colorClass="text-green-700"
        createdBy={createdByName}
      />

      {/* Última Actualización */}
      <AuditInfoItem
        label="Última Actualización"
        value={updatedAt ? formatDateTime(updatedAt) : "Nunca actualizada"}
        icon={<Clock className="h-4 w-4" />}
        colorClass="text-blue-700"
        createdBy={updatedByName}
      />

      {/* ID de la entidad (opcional) */}
      {entityId !== undefined && (
        <AuditInfoItem
          label="ID del Registro"
          value={String(entityId)}
          icon={<Hash className="h-4 w-4" />}
          colorClass="text-gray-700"
        />
      )}
    </div>
  );

  if (asCard) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <h4 className="font-semibold text-base">{title}</h4>
      </div>
      <div className="pl-7">{content}</div>
    </div>
  );
}

/** Props para item individual de auditoría */
interface AuditInfoItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
  createdBy?: string | null;
  subtitle?: string;
}

/** Componente interno para cada item de información */
function AuditInfoItem({
  label,
  value,
  icon,
  colorClass,
  createdBy,
  subtitle,
}: AuditInfoItemProps) {
  return (
    <div className="space-y-2">
      <div className={`text-sm font-medium ${colorClass}`}>{label}</div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {value}
      </div>
      {createdBy && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          Por: {createdBy}
        </div>
      )}
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
