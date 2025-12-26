"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
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

interface BranchFormProps {
  initialData: {
    name: string;
    address: string;
    city: string;
    department: string;
    country: string;
    phone: string;
    isWarehouse: boolean;
  };
  onComplete: (data: {
    name: string;
    address: string;
    city: string;
    department: string;
    country: string;
    phone: string;
    isWarehouse: boolean;
  }) => void;
  onBack: () => void;
  onDataChange?: (data: {
    name: string;
    address: string;
    city: string;
    department: string;
    country: string;
    phone: string;
    isWarehouse: boolean;
  }) => void;
}

export function BranchForm({
  initialData,
  onComplete,
  onBack,
  onDataChange,
}: BranchFormProps) {
  const [name, setName] = useState(initialData.name || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [city, setCity] = useState(initialData.city || "");
  const [department, setDepartment] = useState(initialData.department || "");
  const [country, setCountry] = useState(initialData.country || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [isWarehouse, setIsWarehouse] = useState(
    initialData.isWarehouse || false
  );
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
        name,
        address,
        city,
        department,
        country,
        phone,
        isWarehouse,
      });
    }
  }, [
    name,
    address,
    city,
    department,
    country,
    phone,
    isWarehouse,
  ]); // Removed onDataChange from dependencies

  const validateForm = () => {
    const newErrors: {
      name?: string;
      address?: string;
      city?: string;
      department?: string;
      country?: string;
      phone?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "El nombre de la sucursal es requerido";
    } else if (name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!address.trim()) {
      newErrors.address = "La dirección es requerida";
    }

    if (!city.trim()) {
      newErrors.city = "La ciudad es requerida";
    }

    if (!department.trim()) {
      newErrors.department = "El departamento es requerido";
    }

    if (!country) {
      newErrors.country = "Debe seleccionar un país";
    }

    if (!phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onComplete({
      name,
      address,
      city,
      department,
      country,
      phone,
      isWarehouse,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="name">Nombre de la sucursal</FieldLabel>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sucursal Central"
          required
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name}</p>
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="address">Dirección física</FieldLabel>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Calle 123, Zona Centro"
          required
        />
        {errors.address && (
          <p className="text-sm text-red-500 mt-1">{errors.address}</p>
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
          <p className="text-sm text-red-500 mt-1">{errors.city}</p>
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
          <p className="text-sm text-red-500 mt-1">{errors.department}</p>
        )}
      </Field>
      <Field>
        <CountrySelect
          value={country}
          onChange={(val) => setCountry(val || "")}
          placeholder="Selecciona un país"
        />
        {errors.country && (
          <p className="text-sm text-red-500 mt-1">{errors.country}</p>
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
        <PhoneInput
          value={phone}
          onChange={(val, valid) => setPhone(val)}
          placeholder="59112345678"
          required
        />
        {errors.phone && (
          <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
        )}
      </Field>
      <Field>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isWarehouse"
            checked={isWarehouse}
            onCheckedChange={(checked) => setIsWarehouse(checked === true)}
          />
          <label htmlFor="isWarehouse">¿Es bodega?</label>
        </div>
      </Field>
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
