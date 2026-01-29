"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Building2 } from "lucide-react";
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

          {/* Branch Overview */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-green-600" />
                  Resumen Operativo
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Centro de distribución con encargados asignados
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {branch.managers?.length || 0}
                </div>
                <div className="text-xs text-gray-500">
                  Encargados Activos
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
