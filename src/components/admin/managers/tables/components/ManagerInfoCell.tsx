"use client";

import { TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Manager } from "@/services/admin/managers";

interface ManagerInfoCellProps {
  manager: Manager;
}

export function ManagerInfoCell({ manager }: ManagerInfoCellProps) {
  return (
    <TableCell>
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">
            {manager.firstName[0]}
            {manager.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">
            {manager.firstName} {manager.lastName}
          </div>
          <div className="text-sm text-muted-foreground">CI: {manager.ci}</div>
        </div>
      </div>
    </TableCell>
  );
}
