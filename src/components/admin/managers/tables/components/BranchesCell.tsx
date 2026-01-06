"use client";

import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Manager } from "@/services/admin/managers";

interface BranchesCellProps {
  manager: Manager;
}

export function BranchesCell({ manager }: BranchesCellProps) {
  return (
    <TableCell>
      {manager.branches && manager.branches.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {manager.branches.slice(0, 2).map((branch) => (
            <Badge key={branch.id} variant="default" className="text-xs">
              {branch.name}
            </Badge>
          ))}
          {manager.branches.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{manager.branches.length - 2}
            </Badge>
          )}
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">
          No hay sucursales asignadas
        </span>
      )}
    </TableCell>
  );
}
