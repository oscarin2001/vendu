"use client";

import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

export function BranchStatusBadges() {
  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="default"
        className="bg-blue-50 text-blue-700 border-blue-200"
      >
        <Building2 className="h-3 w-3 mr-1" />
        Tienda
      </Badge>
      <Badge
        variant="outline"
        className="bg-green-50 text-green-700 border-green-200"
      >
        Activa
      </Badge>
    </div>
  );
}
