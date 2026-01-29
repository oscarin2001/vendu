"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Star, Shield, Warehouse, MapPin } from "lucide-react";
import { Warehouse as WarehouseType } from "@/services/admin/warehouses/types/warehouse.types";
import { useState, useEffect } from "react";
import { getBranchesByCompany } from "@/services/admin/branches";
import { assignWarehouseToBranch } from "@/services/admin/warehouses";
import { toast } from "sonner";

interface WarehouseAssignBranchModalProps {
  warehouse: WarehouseType | null;
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
}

export function WarehouseAssignBranchModal({
  warehouse,
  isOpen,
  onClose,
  tenantId,
}: WarehouseAssignBranchModalProps) {
  const [availableBranches, setAvailableBranches] = useState<any[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (isOpen && warehouse) {
      loadAvailableBranches();
    }
  }, [isOpen, warehouse]);

  const loadAvailableBranches = async () => {
    setIsLoadingBranches(true);
    try {
      const branches = await getBranchesByCompany(tenantId);
      // Filter out already assigned branches
      const assignedIds = warehouse?.branches?.map((b) => b.id) || [];
      const available = branches.filter((b) => !assignedIds.includes(b.id));
      setAvailableBranches(available);
    } catch (error) {
      console.error("Error al cargar sucursales:", error);
      toast.error("Error al cargar sucursales");
    } finally {
      setIsLoadingBranches(false);
    }
  };

  const handleAssign = async () => {
    if (!warehouse || !selectedBranchId) return;

    setIsAssigning(true);
    try {
      await assignWarehouseToBranch(
        tenantId,
        warehouse.id,
        parseInt(selectedBranchId),
        isPrimary,
      );
      toast.success(
        isPrimary
          ? "Sucursal designada como bodega principal exitosamente"
          : "Sucursal agregada como bodega secundaria exitosamente",
      );
      onClose();
    } catch (error) {
      console.error("Error al asignar sucursal:", error);
      toast.error("Error al asignar sucursal");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    setSelectedBranchId("");
    setIsPrimary(false);
    onClose();
  };

  if (!warehouse) return null;

  const selectedBranch = availableBranches.find(b => b.id.toString() === selectedBranchId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            Asignar Sucursal a Bodega
          </DialogTitle>
          <DialogDescription>
            Configura las áreas de servicio para la bodega{" "}
            <span className="font-semibold">{warehouse.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Warehouse Info */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Warehouse className="h-5 w-5 text-orange-600" />
              <div>
                <h4 className="font-medium text-orange-900">{warehouse.name}</h4>
                <p className="text-sm text-orange-700">
                  {warehouse.city}, {warehouse.department}
                </p>
              </div>
            </div>
          </div>

          {/* Current Branches */}
          {warehouse.branches && warehouse.branches.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Sucursales Actualmente Asignadas
              </h4>
              <div className="space-y-2">
                {warehouse.branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        branch.isPrimary ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      {branch.isPrimary ? (
                        <Star className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Building2 className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{branch.name}</span>
                        {branch.isPrimary ? (
                          <Badge variant="default" className="text-xs bg-blue-600">
                            <Shield className="h-3 w-3 mr-1" />
                            Principal
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Secundaria
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{branch.address}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
            </div>
          )}

          {/* Branch Selection */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">
              Seleccionar Sucursal Disponible
            </h4>

            {isLoadingBranches ? (
              <div className="text-center py-4 text-gray-500">
                Cargando sucursales disponibles...
              </div>
            ) : availableBranches.length > 0 ? (
              <div className="space-y-4">
                <Select
                  value={selectedBranchId}
                  onValueChange={setSelectedBranchId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBranches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name} - {branch.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedBranch && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      <div className="flex-1">
                        <span className="font-medium text-blue-900">
                          {selectedBranch.name}
                        </span>
                        <p className="text-sm text-blue-700">
                          {selectedBranch.address}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          {selectedBranch.city}, {selectedBranch.department}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Primary/Secondary Selection */}
                {selectedBranch && (
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-900">Tipo de Asignación</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          isPrimary
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setIsPrimary(true)}
                      >
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-blue-600" />
                          <div>
                            <div className="font-medium text-blue-900">
                              Bodega Principal
                            </div>
                            <div className="text-sm text-blue-700">
                              Centro de distribución primario
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          !isPrimary
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setIsPrimary(false)}
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-green-600" />
                          <div>
                            <div className="font-medium text-green-900">
                              Bodega Secundaria
                            </div>
                            <div className="text-sm text-green-700">
                              Centro de respaldo
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No hay sucursales disponibles para asignar</p>
                <p className="text-xs mt-1">
                  Todas las sucursales ya están asignadas a esta bodega
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedBranchId || isAssigning}
          >
            {isAssigning
              ? "Asignando..."
              : isPrimary
                ? "Designar como Principal"
                : "Agregar como Secundaria"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}