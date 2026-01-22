"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { filterNameInput } from "@/services/admin/shared/validations";
import { SUPPLIER_LIMITS, SupplierFormData } from "../types";

interface PersonalSectionProps {
  formData: SupplierFormData;
  errors: Record<string, string>;
  onChange: (field: keyof SupplierFormData, value: any) => void;
}

export function SupplierPersonalSection({
  formData,
  errors,
  onChange,
}: PersonalSectionProps) {
  const handleNameChange = (field: "firstName" | "lastName", value: string) => {
    const filtered = filterNameInput(value);
    onChange(field, filtered.slice(0, SUPPLIER_LIMITS[field].max));
  };

  const handleCiChange = (value: string) => {
    const filtered = value.replace(/[^0-9A-Za-z-]/g, "");
    onChange("ci", filtered.slice(0, SUPPLIER_LIMITS.ci.max));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        Información Personal
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            Nombre <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleNameChange("firstName", e.target.value)}
            placeholder="Nombre"
            className={errors.firstName ? "border-red-500" : ""}
            maxLength={SUPPLIER_LIMITS.firstName.max}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Apellido <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleNameChange("lastName", e.target.value)}
            placeholder="Apellido"
            className={errors.lastName ? "border-red-500" : ""}
            maxLength={SUPPLIER_LIMITS.lastName.max}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ci">Cédula de Identidad</Label>
          <Input
            id="ci"
            value={formData.ci || ""}
            onChange={(e) => handleCiChange(e.target.value)}
            placeholder="Ej: 12345678"
            maxLength={SUPPLIER_LIMITS.ci.max}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
          <DatePicker
            date={formData.birthDate || undefined}
            onSelect={(date) => onChange("birthDate", date || null)}
            placeholder="Seleccionar fecha"
          />
        </div>
      </div>
    </div>
  );
}
