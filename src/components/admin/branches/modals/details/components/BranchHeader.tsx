"use client";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2 } from "lucide-react";
import { Branch } from "@/services/admin/branches";

interface BranchHeaderProps {
  branch: Branch;
}

export function BranchHeader({ branch }: BranchHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="text-lg font-semibold">{branch.name}</div>
          <div className="text-sm text-muted-foreground font-mono">
            ID: #{branch.id.toString().padStart(3, "0")}
          </div>
        </div>
      </DialogTitle>
    </DialogHeader>
  );
}
