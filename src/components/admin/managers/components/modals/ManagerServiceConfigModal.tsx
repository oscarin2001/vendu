"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { User, Star, Plus, X, CheckCircle, Building2 } from "lucide-react";
import { Manager } from "@/services/admin/managers";
import { useState, useEffect, useCallback } from "react";
import { getBranchesByCompany } from "@/services/admin/branches";
import { toast } from "sonner";
import { useManagerAssignments } from "@/services/admin/managers";

interface ManagerServiceConfigModalProps {
  manager: Manager | null;
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  onSuccess?: () => void;
}

interface Branch {
  id: number;
  name: string;
  address?: string;
  isPrimary?: boolean;
}

export function ManagerServiceConfigModal({
  manager,
  isOpen,
  onClose,
  tenantId,
  onSuccess,
}: ManagerServiceConfigModalProps) {
  const [availableBranches, setAvailableBranches] = useState<Branch[]>([]);
  const [assignedBranches, setAssignedBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);

  const { assignBranch, removeBranch } = useManagerAssignments(
    tenantId,
    onSuccess
  );

  const loadBranches = useCallback(async () => {
    try {
      const branches = await getBranchesByCompany(tenantId);
      // Ensure uniqueness by branch ID to prevent duplicates
      const uniqueBranches = branches.filter(
        (branch, index, self) =>
          self.findIndex((b) => b.id === branch.id) === index
      );
      setAvailableBranches(uniqueBranches);
    } catch (error) {
      console.error("Error loading branches:", error);
      toast.error("Error al cargar las sucursales");
    }
  }, [tenantId]);

  // Load branches when modal opens
  useEffect(() => {
    if (isOpen && tenantId) {
      loadBranches();
    }
  }, [isOpen, tenantId, loadBranches]);

  const handleAssignBranch = async (branch: Branch) => {
    if (!manager) return;

    setLoading(true);
    try {
      await assignBranch(manager.id, branch.id);
      // State will be updated via the manager data refresh triggered by onSuccess
    } catch {
      // Error is handled by the hook
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBranch = async (branch: Branch) => {
    if (!manager) return;

    setLoading(true);
    try {
      await removeBranch(manager.id, branch.id);
      // State will be updated via the manager data refresh triggered by onSuccess
    } catch {
      // Error is handled by the hook
    } finally {
      setLoading(false);
    }
  };

  const getUnassignedBranches = () => {
    const filtered = availableBranches.filter(
      (branch) =>
        !assignedBranches.some((assigned) => assigned.id === branch.id)
    );
    // Ensure uniqueness by branch ID to prevent duplicate keys
    const unique = filtered.filter(
      (branch, index, self) =>
        self.findIndex((b) => b.id === branch.id) === index
    );
    return unique;
  };

  if (!manager) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Gestionar Sucursales - {manager.firstName} {manager.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Assignments */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Sucursales Asignadas ({assignedBranches.length})
            </h3>
            {assignedBranches.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay sucursales asignadas</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {assignedBranches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{branch.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {branch.address || "Dirección no disponible"}
                        </p>
                      </div>
                      {branch.isPrimary && (
                        <Badge variant="secondary" className="ml-2">
                          <Star className="h-3 w-3 mr-1" />
                          Principal
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveBranch(branch)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Branches */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-500" />
              Sucursales Disponibles ({getUnassignedBranches().length})
            </h3>
            {getUnassignedBranches().length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Todas las sucursales están asignadas</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {getUnassignedBranches().map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-blue-200"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{branch.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {branch.address || "Dirección no disponible"}
                        </p>
                      </div>
                      {branch.isPrimary && (
                        <Badge variant="secondary" className="ml-2">
                          <Star className="h-3 w-3 mr-1" />
                          Principal
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssignBranch(branch)}
                      disabled={loading}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Asignar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
