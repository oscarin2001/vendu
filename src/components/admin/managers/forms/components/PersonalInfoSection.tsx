"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";

interface PersonalInfoSectionProps {
  firstName: string;
  lastName: string;
  ci: string;
  errors: {
    firstName?: string;
    lastName?: string;
    ci?: string;
  };
  onChange: (field: string, value: string) => void;
}

export function PersonalInfoSection({
  firstName,
  lastName,
  ci,
  errors,
  onChange,
}: PersonalInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Información Personal</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre *</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder="Ingresa el nombre"
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido *</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder="Ingresa el apellido"
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ci">Cédula *</Label>
        <Input
          id="ci"
          value={ci}
          onChange={(e) => onChange("ci", e.target.value)}
          placeholder="Ingresa la cédula"
          className={errors.ci ? "border-red-500" : ""}
        />
        {errors.ci && <p className="text-sm text-red-500">{errors.ci}</p>}
      </div>
    </div>
  );
}
