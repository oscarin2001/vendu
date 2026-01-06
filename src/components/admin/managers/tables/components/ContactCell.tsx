"use client";

import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";
import { Manager } from "@/services/admin/managers";

interface ContactCellProps {
  manager: Manager;
}

export function ContactCell({ manager }: ContactCellProps) {
  return (
    <TableCell>
      <div className="space-y-1">
        <div className="flex items-center gap-1 text-sm">
          <Mail className="h-3 w-3" />
          <span className="truncate max-w-32">{manager.email}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Phone className="h-3 w-3" />
          <span>{manager.phone}</span>
        </div>
      </div>
    </TableCell>
  );
}
