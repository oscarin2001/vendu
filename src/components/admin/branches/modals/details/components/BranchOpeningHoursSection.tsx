"use client";

import { Clock } from "lucide-react";
import { Branch } from "@/services/admin/branches";

interface BranchOpeningHoursSectionProps {
  branch: Branch;
}

export function BranchOpeningHoursSection({
  branch,
}: BranchOpeningHoursSectionProps) {
  if (!branch.openingHours) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        <h4 className="font-semibold text-base">Horarios de Operación</h4>
      </div>
      <div className="pl-7">
        <div className="bg-muted/50 p-3 rounded-lg">
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
            {JSON.stringify(branch.openingHours, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
