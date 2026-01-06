"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/phone-input";
import { CountrySelect } from "@/components/ui/country-select";
import { Checkbox } from "@/components/ui/checkbox";
import { BranchFormErrors } from "../hooks/useBranchForm";

interface BranchFieldsProps {
  name: string;
  address: string;
  city: string;
  department: string;
  country: string;
  phone: string;
  isWarehouse: boolean;
  errors: BranchFormErrors;
  onNameChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onIsWarehouseChange: (value: boolean) => void;
}

export function BranchFields({
  name,
  address,
  city,
  department,
  country,
  phone,
  isWarehouse,
  errors,
  onNameChange,
  onAddressChange,
  onCityChange,
  onDepartmentChange,
  onCountryChange,
  onPhoneChange,
  onIsWarehouseChange,
}: BranchFieldsProps) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor="name">Nombre de la sucursal</FieldLabel>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Sucursal Centro"
          required
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name}</p>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="address">Dirección</FieldLabel>
        <Input
          id="address"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Av. Principal 123"
          required
        />
        {errors.address && (
          <p className="text-sm text-red-600 mt-1">{errors.address}</p>
        )}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="city">Ciudad</FieldLabel>
          <Input
            id="city"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="La Paz"
            required
          />
          {errors.city && (
            <p className="text-sm text-red-600 mt-1">{errors.city}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="department">Departamento</FieldLabel>
          <Input
            id="department"
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            placeholder="La Paz"
            required
          />
          {errors.department && (
            <p className="text-sm text-red-600 mt-1">{errors.department}</p>
          )}
        </Field>
      </div>

      <Field>
        <CountrySelect
          value={country}
          onChange={(val) => onCountryChange(val || "")}
          placeholder="Selecciona un país"
        />
        {errors.country && (
          <p className="text-sm text-red-600 mt-1">{errors.country}</p>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
        <PhoneInput
          value={phone}
          onChange={(val) => onPhoneChange(val)}
          placeholder="59112345678"
          required
        />
        {errors.phone && (
          <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
        )}
      </Field>

      <Field>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isWarehouse"
            checked={isWarehouse}
            onCheckedChange={(checked) =>
              onIsWarehouseChange(checked as boolean)
            }
          />
          <label
            htmlFor="isWarehouse"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Esta sucursal también funciona como almacén
          </label>
        </div>
      </Field>
    </>
  );
}
