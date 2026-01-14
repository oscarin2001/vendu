"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImmutableFieldWarningProps {
  className?: string;
  title?: string;
  description?: string;
}

/**
 * Alerta que informa al usuario que ciertos campos serán permanentes.
 * Usar en onboarding antes de confirmar nombre de empresa.
 */
export function ImmutableFieldWarning({
  className,
  title = "Campos permanentes",
  description = "El nombre de la empresa será permanente una vez creado. Asegúrate de que sea correcto antes de continuar.",
}: ImmutableFieldWarningProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border",
        "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800",
        className
      )}
    >
      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          {title}
        </p>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          {description}
        </p>
      </div>
    </div>
  );
}
