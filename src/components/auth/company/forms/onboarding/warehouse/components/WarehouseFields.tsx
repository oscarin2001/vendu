"use client";

import { Input } from "@/components/ui/Input";
import { Field, FieldLabel } from "@/components/ui/field";
import { PhoneInput } from "@/components/ui/phone-input";
import { CountrySelect } from "@/components/ui/country-select";
import { WarehouseFormErrors } from "../hooks/useWarehouseForm";

interface WarehouseFieldsProps {
  hasWarehouse: boolean;
  name: string;
  address: string;
  city: string;
  department: string;
  country: string;
  phone: string;
  errors: WarehouseFormErrors;
  onHasWarehouseChange: (hasWarehouse: boolean) => void;
  onNameChange: (name: string) => void;
  onAddressChange: (address: string) => void;
  onCityChange: (city: string) => void;
  onDepartmentChange: (department: string) => void;
  onCountryChange: (country: string) => void;
  onPhoneChange: (phone: string) => void;
}

export function WarehouseFields({
  hasWarehouse,
  name,
  address,
  city,
  department,
  country,
  phone,
  errors,
  onHasWarehouseChange,
  onNameChange,
  onAddressChange,
  onCityChange,
  onDepartmentChange,
  onCountryChange,
  onPhoneChange,
}: WarehouseFieldsProps) {
  return (
    <>
      <Field>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="hasWarehouse"
            checked={hasWarehouse}
            onChange={(e) => onHasWarehouseChange(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="hasWarehouse">Sí, tengo una bodega distinta</label>
        </div>
      </Field>

      {hasWarehouse && (
        <>
          <Field>
            <FieldLabel htmlFor="name">Nombre de la bodega</FieldLabel>
            <Input
              id="name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Bodega Central"
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
              placeholder="Calle 456, Zona Industrial"
              required
            />
            {errors.address && (
              <p className="text-sm text-red-600 mt-1">{errors.address}</p>
            )}
          </Field>
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
              placeholder="59187654321"
              required
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
          </Field>
        </>
      )}
    </>
  );
}
