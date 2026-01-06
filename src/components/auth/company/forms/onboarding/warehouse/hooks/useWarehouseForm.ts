"use client";

import { useState, useEffect } from "react";

export interface WarehouseFormData {
  hasWarehouse: boolean;
  name: string;
  address: string;
  city: string;
  department: string;
  country: string;
  phone: string;
}

export interface WarehouseFormErrors {
  name?: string;
  address?: string;
  city?: string;
  department?: string;
  country?: string;
  phone?: string;
}

export function useWarehouseForm(
  initialData: Partial<WarehouseFormData> = {},
  onDataChange?: (data: WarehouseFormData) => void
) {
  const [hasWarehouse, setHasWarehouse] = useState(
    initialData.hasWarehouse || false
  );
  const [name, setName] = useState(initialData.name || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [city, setCity] = useState(initialData.city || "");
  const [department, setDepartment] = useState(initialData.department || "");
  const [country, setCountry] = useState(initialData.country || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [errors, setErrors] = useState<WarehouseFormErrors>({});

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
  }, [hasWarehouse, name, address, city, department, country, phone, onDataChange]);

  const validateForm = (): boolean => {
    const newErrors: WarehouseFormErrors = {};

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

  const getFormData = (): WarehouseFormData => ({
    hasWarehouse,
    name: hasWarehouse ? name : "",
    address: hasWarehouse ? address : "",
    city: hasWarehouse ? city : "",
    department: hasWarehouse ? department : "",
    country: hasWarehouse ? country : "",
    phone: hasWarehouse ? phone : "",
  });

  const resetForm = () => {
    setHasWarehouse(false);
    setName("");
    setAddress("");
    setCity("");
    setDepartment("");
    setCountry("");
    setPhone("");
    setErrors({});
  };

  return {
    // State
    hasWarehouse,
    name,
    address,
    city,
    department,
    country,
    phone,
    errors,

    // Setters
    setHasWarehouse,
    setName,
    setAddress,
    setCity,
    setDepartment,
    setCountry,
    setPhone,

    // Methods
    validateForm,
    getFormData,
    resetForm,
  };
}