"use client";

import { MapPin, Globe } from "lucide-react";
import { Branch } from "@/services/admin/branches";

interface BranchLocationSectionProps {
  branch: Branch;
}

export function BranchLocationSection({ branch }: BranchLocationSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        <h4 className="font-semibold text-base">Ubicación</h4>
      </div>

      <div className="space-y-3 pl-7">
        <div className="space-y-1">
          <div className="text-sm font-medium">Dirección</div>
          <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
            {branch.address}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-sm font-medium">Ciudad</div>
            <div className="text-sm text-muted-foreground">{branch.city}</div>
          </div>
          <div>
            <div className="text-sm font-medium">Departamento</div>
            <div className="text-sm text-muted-foreground">
              {branch.department}
            </div>
          </div>
        </div>

        {branch.country && (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {branch.country}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
