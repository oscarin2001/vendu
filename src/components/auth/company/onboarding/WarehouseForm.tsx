"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field, FieldLabel } from "@/components/ui/field";
import { PhoneInput } from "@/components/ui/phone-input";
import { CountrySelect } from "@/components/ui/country-select";

const countries = [
  "Bolivia",
  "Argentina",
  "Chile",
  "Perú",
  "Colombia",
  "Ecuador",
  "Venezuela",
  "Uruguay",
  "Paraguay",
  "Brasil",
  "México",
  "Estados Unidos",
  "España",
  "Otro",
];

interface WarehouseFormProps {
  initialData?: {
    hasWarehouse: boolean;
    name: string;
    address: string;
    city: string;
    department: string;
    country: string;
    phone: string;
  };
  onComplete?: (data: {
    hasWarehouse: boolean;
    name: string;
    address: string;
    city: string;
    department: string;
    country: string;
    phone: string;
  }) => void;
  onBack?: () => void;
  onDataChange?: (data: {
    hasWarehouse: boolean;
    name: string;
    address: string;
    city: string;
    department: string;
    country: string;
    phone: string;
  }) => void;
}

export function WarehouseForm({
  initialData = {
    hasWarehouse: false,
    name: "",
    address: "",
    city: "",
    department: "",
    country: "",
    phone: "",
  },
  onComplete = () => {},
  onBack = () => {},
  onDataChange,
}: WarehouseFormProps) {
  const [hasWarehouse, setHasWarehouse] = useState(
    initialData.hasWarehouse || false
  );
  const [name, setName] = useState(initialData.name || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [city, setCity] = useState(initialData.city || "");
  const [department, setDepartment] = useState(initialData.department || "");
  const [country, setCountry] = useState(initialData.country || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [errors, setErrors] = useState<{
    name?: string;
    address?: string;
    city?: string;
    department?: string;
    country?: string;
    phone?: string;
  }>({});

  // Save data whenever it changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        hasWarehouse,
        name,
        address,
        city,
        department,
        country,
        phone,
      });
    }
  }, [hasWarehouse, name, address, city, department, country, phone]); // Removed onDataChange from dependencies

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (hasWarehouse) {
      if (!name.trim()) newErrors.name = "El nombre de la bodega es requerido";
      if (!address.trim()) newErrors.address = "La dirección es requerida";
      if (!city.trim()) newErrors.city = "La ciudad es requerida";
      if (!department.trim())
        newErrors.department = "El departamento es requerido";
      if (!country.trim()) newErrors.country = "El país es requerido";
      if (!phone.trim()) newErrors.phone = "El teléfono es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete({
        hasWarehouse,
        name: hasWarehouse ? name : "",
        address: hasWarehouse ? address : "",
        city: hasWarehouse ? city : "",
        department: hasWarehouse ? department : "",
        country: hasWarehouse ? country : "",
        phone: hasWarehouse ? phone : "",
      });
    }
  };

  const handleSkip = () => {
    onComplete({
      hasWarehouse: false,
      name: "",
      address: "",
      city: "",
      department: "",
      country: "",
      phone: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="hasWarehouse"
            checked={hasWarehouse}
            onChange={(e) => setHasWarehouse(e.target.checked)}
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
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setAddress(e.target.value)}
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
              onChange={(e) => setCity(e.target.value)}
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
              onChange={(e) => setDepartment(e.target.value)}
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
              onChange={(val) => setCountry(val || "")}
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
              onChange={(val, valid) => setPhone(val)}
              placeholder="59187654321"
              required
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
          </Field>
        </>
      )}

      <div className="flex space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Atrás
        </Button>
        <Button type="submit" className="flex-1">
          Siguiente
        </Button>
      </div>
    </form>
  );
}
