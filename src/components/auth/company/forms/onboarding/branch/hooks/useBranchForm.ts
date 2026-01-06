import React, { useState, useCallback } from "react";

export interface BranchFormData {
  name: string;
  address: string;
  city: string;
  department: string;
  country: string;
  phone: string;
  isWarehouse: boolean;
}

export interface BranchFormErrors {
  name?: string;
  address?: string;
  city?: string;
  department?: string;
  country?: string;
  phone?: string;
}

export function useBranchForm(
  initialData: Partial<BranchFormData> = {},
  onDataChange?: (data: BranchFormData) => void
) {
  const [name, setName] = useState(initialData.name || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [city, setCity] = useState(initialData.city || "");
  const [department, setDepartment] = useState(initialData.department || "");
  const [country, setCountry] = useState(initialData.country || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [isWarehouse, setIsWarehouse] = useState(
    initialData.isWarehouse || false
  );
  const [errors, setErrors] = useState<BranchFormErrors>({});

  const validateForm = useCallback(() => {
    const newErrors: BranchFormErrors = {};

    if (!name.trim()) {
      newErrors.name = "El nombre de la sucursal es requerido";
    } else if (name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!address.trim()) {
      newErrors.address = "La dirección es requerida";
    } else if (address.trim().length < 5) {
      newErrors.address = "La dirección debe tener al menos 5 caracteres";
    }

    if (!city.trim()) {
      newErrors.city = "La ciudad es requerida";
    } else if (city.trim().length < 2) {
      newErrors.city = "La ciudad debe tener al menos 2 caracteres";
    }

    if (!department.trim()) {
      newErrors.department = "El departamento es requerido";
    }

    if (!country) {
      newErrors.country = "Debe seleccionar un país";
    }

    if (!phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    } else if (phone.replace(/\D/g, "").length < 8) {
      newErrors.phone = "El teléfono debe tener al menos 8 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, address, city, department, country, phone]);

  const getFormData = useCallback(
    (): BranchFormData => ({
      name,
      address,
      city,
      department,
      country,
      phone,
      isWarehouse,
    }),
    [name, address, city, department, country, phone, isWarehouse]
  );

  // Notify parent component of data changes
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(getFormData());
    }
  }, [
    name,
    address,
    city,
    department,
    country,
    phone,
    isWarehouse,
    onDataChange,
    getFormData,
  ]);

  return {
    name,
    address,
    city,
    department,
    country,
    phone,
    isWarehouse,
    errors,
    setName,
    setAddress,
    setCity,
    setDepartment,
    setCountry,
    setPhone,
    setIsWarehouse,
    validateForm,
    getFormData,
  };
}
