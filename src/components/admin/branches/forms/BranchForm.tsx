"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BranchFormData {
  name: string;
  isWarehouse: boolean;
  phone: string;
  address: string;
  city: string;
  department: string;
  country: string;
  managerId?: number;
}

interface BranchFormProps {
  initialData?: Partial<BranchFormData>;
  managers?: { id: number; name: string }[];
  onSubmit: (data: BranchFormData) => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export function BranchForm({ initialData, managers = [], onSubmit, isLoading, mode }: BranchFormProps) {
  const [formData, setFormData] = useState<BranchFormData>({
    name: initialData?.name || "",
    isWarehouse: initialData?.isWarehouse || false,
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    department: initialData?.department || "",
    country: initialData?.country || "",
    managerId: initialData?.managerId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof BranchFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "Crear Sucursal" : "Editar Sucursal"}</CardTitle>
      </CardHeader>
      <CardContent>
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

            <div className="md:col-span-2 flex items-center space-x-2">
              <Checkbox
                id="isWarehouse"
                checked={formData.isWarehouse}
                onCheckedChange={(checked) => handleChange("isWarehouse", !!checked)}
              />
              <Label htmlFor="isWarehouse">Esta sucursal es una bodega</Label>
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
              <Label htmlFor="manager">Encargado (opcional)</Label>
              <Select
                value={formData.managerId?.toString() || ""}
                onValueChange={(value) => handleChange("managerId", value ? parseInt(value) : undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar encargado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin encargado</SelectItem>
                  {managers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id.toString()}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Guardando..." : mode === "create" ? "Crear Sucursal" : "Guardar Cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}