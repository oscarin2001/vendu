import React, { useState, useCallback } from "react";

export interface OwnerFormData {
  firstName: string;
  lastName: string;
  phone: string;
  ci: string;
  gender: string;
  country: string;
  birthDate?: string;
  joinedAt?: string;
  contractEndAt?: string;
}

export interface OwnerFormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  ci?: string;
  gender?: string;
  birthDate?: string;
  joinedAt?: string;
}

export function useOwnerForm(
  initialData: Partial<OwnerFormData> = {},
  onDataChange?: (data: OwnerFormData) => void,
  companyCountry?: string
) {
  const [firstName, setFirstName] = useState(initialData.firstName || "");
  const [lastName, setLastName] = useState(initialData.lastName || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [ci, setCi] = useState(initialData.ci || "");
  const [gender, setGender] = useState(initialData.gender || "");
  const [country, setCountry] = useState(
    initialData.country || companyCountry || ""
  );
  const [birthDate, setBirthDate] = useState(initialData.birthDate || "");
  const [joinedAt, setJoinedAt] = useState(initialData.joinedAt || "");
  const [contractEndAt, setContractEndAt] = useState<string>("");
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

    if (birthDate && isNaN(Date.parse(birthDate))) {
      newErrors.birthDate = "Fecha de nacimiento inválida";
    }

    if (joinedAt && isNaN(Date.parse(joinedAt))) {
      newErrors.joinedAt = "Fecha de ingreso inválida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [firstName, lastName, phone, ci, gender, birthDate, joinedAt]);

  const getFormData = useCallback(
    (): OwnerFormData => ({
      firstName,
      lastName,
      phone,
      ci,
      gender,
      country,
      birthDate,
      joinedAt,
      contractEndAt,
    }),
    [firstName, lastName, phone, ci, gender, country, birthDate, joinedAt, contractEndAt]
  );

  // Notify parent component of data changes
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(getFormData());
    }
  }, [
    firstName,
    lastName,
    phone,
    ci,
    gender,
    country,
    birthDate,
    joinedAt,
    contractEndAt,
    onDataChange,
    getFormData,
  ]);

  const handlePhoneChange = useCallback((value: string, valid?: boolean) => {
    setPhone(value);
    if (valid !== undefined) {
      setPhoneValid(valid);
    }
  }, []);

  const setPhoneValue = useCallback((value: string) => {
    setPhone(value);
    setPhoneValid(null); // Reset validation when manually setting
  }, []);

  return {
    firstName,
    lastName,
    phone,
    phoneValid,
    ci,
    gender,
    country,
    joinedAt,
    contractEndAt,
    birthDate,
    errors,
    setFirstName,
    setLastName,
    setPhone: setPhoneValue,
    setCi,
    setGender,
    setCountry,
    setBirthDate,
    setJoinedAt,
    setContractEndAt,
    setErrors,
    handlePhoneChange,
    validateForm,
    getFormData,
  };
}
