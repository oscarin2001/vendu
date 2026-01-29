"use client";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { Branch } from "@/services/admin/branches";

interface BranchHeaderProps {
  branch: Branch;
}

export function BranchHeader({ branch }: BranchHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
          <Building2 className="h-5 w-5 text-green-600 flex-shrink-0" />
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className="text-lg font-semibold text-gray-900 truncate"
            title={branch.name}
          >
            {branch.name}
          </h3>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              ID: {branch.id}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Sucursal
            </Badge>
            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
              Activa
            </Badge>
          </div>
        </div>
      </DialogTitle>
    </DialogHeader>
  );
}
