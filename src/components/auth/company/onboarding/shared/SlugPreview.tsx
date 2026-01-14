"use client";

import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlugPreviewProps {
  slug: string;
  status: "idle" | "loading" | "available" | "unavailable";
  className?: string;
}

/**
 * Componente que muestra una preview de la URL generada a partir del nombre de la empresa.
 * Se actualiza dinámicamente y muestra el estado de validación.
 */
export function SlugPreview({ slug, status, className }: SlugPreviewProps) {
  const baseUrl = "vendu.com";

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        );
      case "available":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "unavailable":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "loading":
        return "Verificando disponibilidad...";
      case "available":
        return "URL disponible";
      case "unavailable":
        return "Nombre ya existe, elige otro";
      default:
        return "Tu URL aparecerá aquí";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "available":
        return "text-green-700 dark:text-green-300";
      case "unavailable":
        return "text-red-700 dark:text-red-300";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-sm">
        {getStatusIcon()}
        <span className={getStatusColor()}>{getStatusText()}</span>
      </div>

      {slug && (
        <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
          <span className="text-sm font-mono text-muted-foreground">
            {baseUrl}/
          </span>
          <span
            className={cn(
              "text-sm font-mono font-medium",
              status === "available"
                ? "text-green-700 dark:text-green-300"
                : status === "unavailable"
                ? "text-red-700 dark:text-red-300"
                : "text-foreground"
            )}
          >
            {slug}
          </span>
        </div>
      )}
    </div>
  );
}
