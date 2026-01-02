"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Warehouse } from "lucide-react";

interface WarehouseFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  country: string;
}

interface WarehouseFormProps {
  initialData?: Partial<WarehouseFormData>;
  onSubmit: (data: WarehouseFormData) => void;
  isLoading?: boolean;
  mode: "create" | "edit";
  warehouseInfo?: {
    id: number;
    createdAt: Date;
    updatedAt?: Date;
  };
}

export function WarehouseForm({
  initialData,
  onSubmit,
  isLoading,
  mode,
  warehouseInfo,
}: WarehouseFormProps) {
  const [formData, setFormData] = useState<WarehouseFormData>({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    department: initialData?.department || "",
    country: initialData?.country || "Bolivia",
  });

  const [errors, setErrors] = useState<Partial<WarehouseFormData>>({});

  const validateForm = () => {
    const newErrors: Partial<WarehouseFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la bodega es requerido";
    }

    if (!formData.address.trim()) {
      newErrors.address = "La dirección es requerida";
    }

    if (!formData.city.trim()) {
      newErrors.city = "La ciudad es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof WarehouseFormData, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Warehouse className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">
            {mode === "create" ? "Crear Bodega" : "Editar Bodega"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {mode === "create"
              ? "Agrega una nueva bodega a tu red de distribución"
              : "Modifica la información de la bodega"}
          </p>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Bodega *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ej: Bodega Central Norte"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Ej: +591 2 1234567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Ej: Calle 123, Zona Norte"
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Ej: La Paz"
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                placeholder="Ej: La Paz"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleChange("country", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bolivia">Bolivia</SelectItem>
                  <SelectItem value="Perú">Perú</SelectItem>
                  <SelectItem value="Chile">Chile</SelectItem>
                  <SelectItem value="Argentina">Argentina</SelectItem>
                  <SelectItem value="Brasil">Brasil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      {warehouseInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">ID:</span> {warehouseInfo.id}
              </div>
              <div>
                <span className="font-medium">Creado:</span>{" "}
                {new Date(warehouseInfo.createdAt).toLocaleDateString("es-ES")}
              </div>
              {warehouseInfo.updatedAt && (
                <div className="col-span-2">
                  <span className="font-medium">Última modificación:</span>{" "}
                  {new Date(warehouseInfo.updatedAt).toLocaleDateString("es-ES")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : mode === "create" ? "Crear Bodega" : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}