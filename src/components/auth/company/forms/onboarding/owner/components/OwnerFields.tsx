"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/Input";
import { PhoneInput, COUNTRIES } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OwnerFormErrors } from "../hooks/useOwnerForm";

interface OwnerFieldsProps {
  firstName: string;
  lastName: string;
  phone: string;
  ci: string;
  gender: string;
  errors: OwnerFormErrors;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onCiChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  companyCountry?: string;
}

export function OwnerFields({
  firstName,
  lastName,
  phone,
  ci,
  gender,
  errors,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
  onCiChange,
  onGenderChange,
  companyCountry,
}: OwnerFieldsProps) {
  const fixedCountryCode = companyCountry
    ? COUNTRIES.find(
        (c) =>
          c.name
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .toLowerCase() ===
          companyCountry
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .toLowerCase()
      )?.code
    : undefined;

  const fixedLocalMax = companyCountry
    ? COUNTRIES.find(
        (c) =>
          c.name
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .toLowerCase() ===
          companyCountry
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .toLowerCase()
      )?.local
    : undefined;
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
          placeholder="59112345678"
          required
          fixedCountryCode={fixedCountryCode}
          fixedLocalMax={fixedLocalMax}
          hideCountrySelect={true}
        />
        {errors.phone && (
          <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
        )}
      </Field>

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
