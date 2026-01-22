"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import {
  filterNameInput,
  filterCIInput,
  filterAddressInput,
  FIELD_LIMITS,
} from "@/services/admin/shared/validations";

interface PersonalInfoSectionProps {
  firstName: string;
  lastName: string;
  ci: string;
  birthDate?: Date;
  homeAddress?: string;
  country?: string;
  errors: {
    firstName?: string;
    lastName?: string;
    ci?: string;
    birthDate?: string;
    homeAddress?: string;
  };
  onChange: (field: string, value: any) => void;
}

export function PersonalInfoSection({
  firstName,
  lastName,
  ci,
  birthDate,
  homeAddress,
  country,
  errors,
  onChange,
}: PersonalInfoSectionProps) {
  const handleNameChange = (field: string, value: string) => {
    const filtered = filterNameInput(value).slice(
      0,
      FIELD_LIMITS.firstName.max,
    );
    onChange(field, filtered);
  };

  const handleCIChange = (value: string) => {
    onChange("ci", filterCIInput(value, country));
  };

  const handleHomeAddressChange = (value: string) => {
    const filtered = filterAddressInput(value, FIELD_LIMITS.homeAddress.max);
    onChange("homeAddress", filtered);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Información Personal</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="firstName" className="text-xs">
            Nombre *{" "}
            <span className="text-muted-foreground">
              (máx. {FIELD_LIMITS.firstName.max})
            </span>
          </Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => handleNameChange("firstName", e.target.value)}
            placeholder="Solo letras"
            maxLength={FIELD_LIMITS.firstName.max}
            className={`h-9 ${errors.firstName ? "border-red-500" : ""}`}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="lastName" className="text-xs">
            Apellido *{" "}
            <span className="text-muted-foreground">
              (máx. {FIELD_LIMITS.lastName.max})
            </span>
          </Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => handleNameChange("lastName", e.target.value)}
            placeholder="Solo letras"
            maxLength={FIELD_LIMITS.lastName.max}
            className={`h-9 ${errors.lastName ? "border-red-500" : ""}`}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="ci" className="text-xs">
          Cédula de Identidad *
        </Label>
        <Input
          id="ci"
          value={ci}
          onChange={(e) => handleCIChange(e.target.value)}
          placeholder="Solo números"
          className={`h-9 max-w-[200px] ${errors.ci ? "border-red-500" : ""}`}
        />
        {errors.ci && <p className="text-xs text-red-500">{errors.ci}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="birthDate" className="text-xs">
            Fecha de Nacimiento
          </Label>
          <Input
            id="birthDate"
            type="date"
            value={birthDate ? birthDate.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              onChange(
                "birthDate",
                e.target.value ? new Date(e.target.value) : undefined,
              )
            }
            className={`h-9 ${errors.birthDate ? "border-red-500" : ""}`}
          />
          {errors.birthDate && (
            <p className="text-xs text-red-500">{errors.birthDate}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="homeAddress" className="text-xs">
          Dirección Particular
        </Label>
        <Input
          id="homeAddress"
          value={homeAddress || ""}
          onChange={(e) => handleHomeAddressChange(e.target.value)}
          maxLength={FIELD_LIMITS.homeAddress.max}
          placeholder="Dirección personal"
          className={`h-9 ${errors.homeAddress ? "border-red-500" : ""}`}
        />
        {errors.homeAddress && (
          <p className="text-xs text-red-500">{errors.homeAddress}</p>
        )}
      </div>
    </div>
  );
}
