"use client";

import { AlertTriangle } from "lucide-react";

export function DeleteWarning() {
  return (
    <div className="bg-red-100 dark:bg-red-950/50 p-4 rounded-md border border-red-300 dark:border-red-700">
      <div className="flex items-center gap-2 text-red-800 dark:text-red-200 font-semibold">
        <AlertTriangle className="h-4 w-4" />
        Última Confirmación
      </div>
      <div className="text-sm text-red-700 dark:text-red-300 mt-1">
        Esta es tu última oportunidad para cancelar. La eliminación de la
        sucursal será permanente.
      </div>
    </div>
  );
}
