"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Branch } from "@/services/admin/branches";
import {
  BranchHeader,
  BranchStatusBadges,
  BranchLocationSection,
  BranchContactSection,
  BranchAuditSection,
  BranchOpeningHoursSection,
  BranchWarehousesSection,
  BranchManagersSection,
} from "./components";

interface BranchDetailsModalProps {
  branch: Branch | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BranchDetailsModal({
  branch,
  isOpen,
  onClose,
}: BranchDetailsModalProps) {
  if (!branch) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <BranchHeader branch={branch} />

        <div className="space-y-6 mt-4">
          <BranchStatusBadges />

          <Separator />

          {/* Location & Contact Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <BranchLocationSection branch={branch} />
            <BranchContactSection branch={branch} />
          </div>

          <Separator />

          {/* Assignments Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <BranchManagersSection branch={branch} />
            <BranchWarehousesSection branch={branch} />
          </div>

          <Separator />

          <BranchOpeningHoursSection branch={branch} />

          <Separator />

          <BranchAuditSection branch={branch} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
