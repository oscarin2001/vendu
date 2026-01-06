"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";

interface CompanyFormData {
  name: string;
  taxId?: string;
  country: string;
  address?: string;
}

interface CompanyFormFieldsProps {
  formData: CompanyFormData;
  onChange: (field: keyof CompanyFormData, value: any) => void;
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export function CompanyFormFields({
  formData,
  onChange,
  onSubmit,
  isLoading,
  mode,
}: CompanyFormFieldsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="name">Nombre de la Empresa</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Ej: Mi Empresa S.A."
            required
          />
        </div>

        <div>
          <Label htmlFor="taxId">ID Fiscal / NIT</Label>
          <Input
            id="taxId"
            value={formData.taxId}
            onChange={(e) => onChange("taxId", e.target.value)}
            placeholder="Ej: 123456789"
          />
        </div>

        <div>
          <Label htmlFor="country">País</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => onChange("country", e.target.value)}
            placeholder="Ej: Bolivia"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Dirección completa de la empresa"
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading
          ? "Guardando..."
          : mode === "create"
          ? "Crear Empresa"
          : "Guardar Cambios"}
      </Button>
    </form>
  );
}
