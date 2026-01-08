import React, { useState, useCallback } from "react";

export interface CompanyFormData {
  name: string;
  country: string;
  phone: string;
  department?: string;
  commerceType?: string;
  openedAt?: string;
}

export interface CompanyFormErrors {
  name?: string;
  country?: string;
  phone?: string;
  openedAt?: string;
}

export function useCompanyForm(
  initialData: Partial<CompanyFormData> = {},
  onDataChange?: (data: CompanyFormData) => void
) {
  const [name, setName] = useState(initialData.name || "");
  const [country, setCountry] = useState(initialData.country || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [department, setDepartment] = useState(initialData.department || "");
  const [commerceType, setCommerceType] = useState(
    initialData.commerceType || ""
  );
  const [openedAt, setOpenedAt] = useState(initialData.openedAt || "");
  const [errors, setErrors] = useState<CompanyFormErrors>({});

  const validateForm = useCallback(() => {
    const newErrors: CompanyFormErrors = {};

    if (!name.trim()) newErrors.name = "El nombre de la empresa es requerido";
    else if (name.trim().length < 2)
      newErrors.name = "El nombre debe tener al menos 2 caracteres";

    if (!country) newErrors.country = "Debe seleccionar un país";

    if (!phone.trim()) newErrors.phone = "El celular es requerido";
    else if (phone.replace(/\D/g, "").length < 8)
      newErrors.phone = "El celular debe tener al menos 8 dígitos";

    if (!openedAt) newErrors.openedAt = "Indica la fecha de apertura física";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, country, phone, openedAt]);

  const getFormData = useCallback(
    (): CompanyFormData => ({
      name,
      country,
      phone,
      department,
      commerceType,
      openedAt,
    }),
    [name, country, phone, department, commerceType, openedAt]
  );

  React.useEffect(() => {
    if (onDataChange) onDataChange(getFormData());
  }, [name, country, phone, department, commerceType, openedAt, onDataChange, getFormData]);

  return {
    name,
    country,
    phone,
    department,
    commerceType,
    openedAt,
    errors,
    setName,
    setCountry,
    setPhone,
    setDepartment,
    setCommerceType,
    setOpenedAt,
    validateForm,
    getFormData,
  };
}
