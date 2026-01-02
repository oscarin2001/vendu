"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Users, Truck } from "lucide-react";

interface BranchFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  country: string;
  managerIds: number[];
  supplierIds: number[];
}

interface BranchFormProps {
  initialData?: Partial<BranchFormData>;
  managers?: { id: number; name: string }[];
  suppliers?: { id: number; supplierNumber: string; name: string }[];
  onSubmit: (data: BranchFormData) => void;
  isLoading?: boolean;
  mode: "create" | "edit";
  branchInfo?: {
    id: number;
    createdAt: Date;
    updatedAt?: Date;
  };
}

export function BranchForm({
  initialData,
  managers = [],
  suppliers = [],
  onSubmit,
  isLoading,
  mode,
  branchInfo,
}: BranchFormProps) {
  const [formData, setFormData] = useState<BranchFormData>({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    department: initialData?.department || "",
    country: initialData?.country || "",
    managerIds: initialData?.managerIds || [],
    supplierIds: initialData?.supplierIds || [],
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("Updating form data with initialData:", initialData);
      setFormData({
        name: initialData.name || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        city: initialData.city || "",
        department: initialData.department || "",
        country: initialData.country || "",
        managerIds: initialData.managerIds || [],
        supplierIds: initialData.supplierIds || [],
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof BranchFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleManagerToggle = (managerId: number) => {
    setFormData((prev) => ({
      ...prev,
      managerIds: prev.managerIds.includes(managerId)
        ? prev.managerIds.filter((id) => id !== managerId)
        : [...prev.managerIds, managerId],
    }));
  };

  const removeManager = (managerId: number) => {
    setFormData((prev) => ({
      ...prev,
      managerIds: prev.managerIds.filter((id) => id !== managerId),
    }));
  };

  const selectedManagers = managers.filter((manager) =>
    formData.managerIds.includes(manager.id)
  );

  const handleSupplierToggle = (supplierId: number) => {
    setFormData((prev) => ({
      ...prev,
      supplierIds: prev.supplierIds.includes(supplierId)
        ? prev.supplierIds.filter((id) => id !== supplierId)
        : [...prev.supplierIds, supplierId],
    }));
  };

  const removeSupplier = (supplierId: number) => {
    setFormData((prev) => ({
      ...prev,
      supplierIds: prev.supplierIds.filter((id) => id !== supplierId),
    }));
  };

  const selectedSuppliers = suppliers.filter((supplier) =>
    formData.supplierIds.includes(supplier.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Crear Sucursal" : "Editar Sucursal"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mode === "edit" && branchInfo && (
          <div className="mb-6">
            <Card className="border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Información de Auditoría
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">
                      ID de Sucursal
                    </Label>
                    <p className="font-medium">#{branchInfo.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Fecha de Creación
                    </Label>
                    <p className="font-medium">
                      {new Date(branchInfo.createdAt).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Última Actualización
                    </Label>
                    <p className="font-medium">
                      {branchInfo.updatedAt
                        ? new Date(branchInfo.updatedAt).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "Nunca"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Nombre de la Sucursal</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ej: Sucursal Centro"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Ej: +591 12345678"
              />
            </div>

            <div>
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                placeholder="Ej: Bolivia"
                required
              />
            </div>

            <div>
              <Label htmlFor="department">Departamento</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                placeholder="Ej: La Paz"
              />
            </div>

            <div>
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Ej: La Paz"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Dirección completa de la sucursal"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label>Encargados (opcional)</Label>
              <div className="space-y-3">
                {/* Managers seleccionados */}
                {selectedManagers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedManagers.map((manager) => (
                      <Badge
                        key={manager.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <Users className="h-3 w-3" />
                        {manager.name}
                        <button
                          type="button"
                          onClick={() => removeManager(manager.id)}
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Lista de managers disponibles */}
                <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                  <div className="text-sm text-muted-foreground mb-2">
                    Seleccionar encargados:
                  </div>
                  <div className="space-y-2">
                    {managers.map((manager) => {
                      const isSelected = formData.managerIds.includes(
                        manager.id
                      );
                      return (
                        <div
                          key={manager.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`manager-${manager.id}`}
                            checked={isSelected}
                            onCheckedChange={() =>
                              handleManagerToggle(manager.id)
                            }
                          />
                          <Label
                            htmlFor={`manager-${manager.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {manager.name}
                          </Label>
                        </div>
                      );
                    })}
                    {managers.length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No hay encargados disponibles
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <Label>Proveedores (opcional)</Label>
              <div className="space-y-3">
                {/* Suppliers seleccionados */}
                {selectedSuppliers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedSuppliers.map((supplier) => (
                      <Badge
                        key={supplier.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <Truck className="h-3 w-3" />
                        {supplier.name}
                        <button
                          type="button"
                          onClick={() => removeSupplier(supplier.id)}
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Lista de suppliers disponibles */}
                <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                  <div className="text-sm text-muted-foreground mb-2">
                    Seleccionar proveedores:
                  </div>
                  <div className="space-y-2">
                    {suppliers.map((supplier) => {
                      const isSelected = formData.supplierIds.includes(
                        supplier.id
                      );
                      return (
                        <div
                          key={supplier.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`supplier-${supplier.id}`}
                            checked={isSelected}
                            onCheckedChange={() =>
                              handleSupplierToggle(supplier.id)
                            }
                          />
                          <Label
                            htmlFor={`supplier-${supplier.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {supplier.name}
                          </Label>
                        </div>
                      );
                    })}
                    {suppliers.length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No hay proveedores disponibles
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading
              ? "Guardando..."
              : mode === "create"
              ? "Crear Sucursal"
              : "Guardar Cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
