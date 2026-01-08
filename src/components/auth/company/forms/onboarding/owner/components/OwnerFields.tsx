"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCountryConfigByName } from "@/services/admin/config/countries";
import { OwnerFormErrors } from "../hooks/useOwnerForm";

interface OwnerFieldsProps {
  firstName: string;
  lastName: string;
  phone: string;
  ci: string;
  gender: string;
  companyCountry?: string;
  errors: OwnerFormErrors;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onCiChange: (value: string) => void;
  onGenderChange: (value: string) => void;
}

export function OwnerFields({
  firstName,
  lastName,
  phone,
  ci,
  gender,
  companyCountry,
  errors,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
  onCiChange,
  onGenderChange,
}: OwnerFieldsProps) {
  const countryConfig = getCountryConfigByName(companyCountry);

  return (
    <>
      <Field>
        <FieldLabel htmlFor="firstName">Nombre</FieldLabel>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          placeholder="Juan"
          required
        />
        {errors.firstName && (
          <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="lastName">Apellido</FieldLabel>
        <Input
          id="lastName"
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          placeholder="Pérez"
          required
        />
        {errors.lastName && (
          <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="ci">Cédula de Identidad</FieldLabel>
        <Input
          id="ci"
          value={ci}
          onChange={(e) => onCiChange(e.target.value)}
          placeholder="12345678"
          required
        />
        {errors.ci && <p className="text-sm text-red-600 mt-1">{errors.ci}</p>}
      </Field>

      <Field>
        <FieldLabel htmlFor="phone">Celular</FieldLabel>
        <PhoneInput
          value={phone}
          onChange={(val) => onPhoneChange(val)}
          placeholder={
            countryConfig
              ? countryConfig.phone.format ??
                `+${countryConfig.phone.prefix} ${"X".repeat(
                  countryConfig.phone.local
                )}`
              : "59112345678"
          }
          required
          fixedCountryCode={countryConfig?.phone.prefix}
          fixedLocalMax={countryConfig?.phone.local}
          hideCountrySelect
          showFormatHint={!countryConfig}
        />
        {errors.phone && (
          <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
        )}
      </Field>

      {countryConfig && (
        <Field>
          <FieldLabel>Moneda del País</FieldLabel>
          <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
            <span className="text-lg">{countryConfig.currency.symbol}</span>
            <span className="text-sm text-muted-foreground">
              {countryConfig.currency.code} - {countryConfig.currency.locale}
            </span>
          </div>
        </Field>
      )}

      <Field>
        <FieldLabel htmlFor="gender">Género</FieldLabel>
        <Select value={gender} onValueChange={onGenderChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un género" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="masculino">Masculino</SelectItem>
            <SelectItem value="femenino">Femenino</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && (
          <p className="text-sm text-red-600 mt-1">{errors.gender}</p>
        )}
      </Field>
    </>
  );
}
