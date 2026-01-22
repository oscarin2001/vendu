"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

interface BranchFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  country: string;
}

interface BranchFormFieldsProps {
  formData: BranchFormData;
  onChange: (field: keyof BranchFormData, value: any) => void;
  onSubmit: (data: BranchFormData) => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export function BranchFormFields({
  formData,
  onChange,
  onSubmit,
  isLoading,
  mode,
}: BranchFormFieldsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="name">Nombre de la Sucursal</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Ej: Sucursal Centro"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="Ej: +591 12345678"
          />
        </div>

        <div>
          <Label className="flex items-center gap-1" htmlFor="country">
            País
            <Lock className="h-3 w-3 text-muted-foreground" />
          </Label>
          <Input
            id="country"
            value={formData.country}
            disabled
            className="h-9 bg-muted cursor-not-allowed"
          />
        </div>

        <div>
          <Label htmlFor="department">Departamento</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => onChange("department", e.target.value)}
            placeholder="Ej: La Paz"
          />
        </div>

        <div>
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="Ej: La Paz"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Dirección completa de la sucursal"
            required
          />
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
  );
}
