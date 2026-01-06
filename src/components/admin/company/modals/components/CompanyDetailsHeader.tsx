"use client";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2 } from "lucide-react";

export function CompanyDetailsHeader() {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="text-lg font-semibold">Detalles de la Empresa</div>
          <div className="text-sm text-muted-foreground">
            Información completa de la empresa
          </div>
        </div>
      </DialogTitle>
    </DialogHeader>
  );
}
