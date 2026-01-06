"use client";

import { Building } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-muted-foreground">
        <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No hay encargados</h3>
        <p>Crea tu primer encargado para comenzar.</p>
      </div>
    </div>
  );
}
