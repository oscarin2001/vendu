"use client";

import { TableCell } from "@/components/ui/table";
import { Manager } from "@/services/admin/managers";

interface HireDateCellProps {
  manager: Manager;
}

export function HireDateCell({ manager }: HireDateCellProps) {
  return (
    <TableCell className="text-sm text-muted-foreground">
      {new Date(manager.hireDate).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </TableCell>
  );
}
