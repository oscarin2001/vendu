import React, { useState, useCallback } from "react";

export interface OwnerFormData {
  firstName: string;
  lastName: string;
  phone: string;
  ci: string;
  gender: string;
}

export interface OwnerFormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  ci?: string;
  gender?: string;
}

export function useOwnerForm(
  initialData: Partial<OwnerFormData> = {},
  onDataChange?: (data: OwnerFormData) => void
) {
  const [firstName, setFirstName] = useState(initialData.firstName || "");
  const [lastName, setLastName] = useState(initialData.lastName || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [ci, setCi] = useState(initialData.ci || "");
  const [gender, setGender] = useState(initialData.gender || "");
  const [errors, setErrors] = useState<OwnerFormErrors>({});

  const validateForm = useCallback(() => {
    const newErrors: OwnerFormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = "El nombre debe tener al menos 2 caracteres";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres";
    }

    if (!phone.trim()) {
      newErrors.phone = "El celular es requerido";
    } else if (phone.replace(/\D/g, "").length < 8) {
      newErrors.phone = "El celular debe tener al menos 8 dígitos";
    }

    if (!ci.trim()) {
      newErrors.ci = "La cédula de identidad es requerida";
    } else if (ci.replace(/\D/g, "").length < 5) {
      newErrors.ci = "La cédula debe tener al menos 5 dígitos";
    }

    if (!gender) {
      newErrors.gender = "Debe seleccionar un género";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [firstName, lastName, phone, ci, gender]);

  const getFormData = useCallback(
    (): OwnerFormData => ({
      firstName,
      lastName,
      phone,
      ci,
      gender,
    }),
    [firstName, lastName, phone, ci, gender]
  );

  // Notify parent component of data changes
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(getFormData());
    }
  }, [firstName, lastName, phone, ci, gender, onDataChange, getFormData]);

  return {
    firstName,
    lastName,
    phone,
    ci,
    gender,
    errors,
    setFirstName,
    setLastName,
    setPhone,
    setCi,
    setGender,
    validateForm,
    getFormData,
  };
}
