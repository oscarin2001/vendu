"use client";

import { useTransition } from "react";
import { OwnerFields } from "./components/OwnerFields";
import { OwnerActions } from "./components/OwnerActions";
import { useOwnerForm, OwnerFormData } from "./hooks/useOwnerForm";
import { saveOwnerData } from "@/services/auth/company-registration/onboarding/actions";
import { getPhoneMissingDigitsMessage } from "@/services/admin/config";

interface OwnerFormProps {
  initialData?: Partial<OwnerFormData>;
  onBack?: () => void;
  onDataChange?: (data: OwnerFormData) => void;
  onNext?: () => void;
  companyCountry?: string;
}

export function OwnerForm({
  initialData = {
    firstName: "",
    lastName: "",
    phone: "",
    ci: "",
    gender: "",
  },
  onBack = () => {},
  onDataChange,
  onNext = () => {},
  companyCountry,
}: OwnerFormProps) {
  const [isPending, startTransition] = useTransition();
  const {
    firstName,
    lastName,
    phone,
    phoneValid,
    ci,
    gender,
    errors,
    setFirstName,
    setLastName,
    setPhone,
    setCi,
    setGender,
    setErrors,
    handlePhoneChange,
    validateForm,
    getFormData,
  } = useOwnerForm(initialData, onDataChange);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // extra phone validation from PhoneInput
    const phoneMessage = getPhoneMissingDigitsMessage(
      phone,
      companyCountry || ""
    );
    if (phoneMessage) {
      setErrors((prev) => ({ ...prev, phone: phoneMessage }));
      return;
    }

    if (phoneValid === false) {
      setErrors((prev) => ({
        ...prev,
        phone: "El celular tiene formato inválido para el país seleccionado",
      }));
      return;
    }

    const formData = new FormData();
    const data = getFormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      saveOwnerData(formData);
    });

    onNext?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <OwnerFields
        firstName={firstName}
        lastName={lastName}
        phone={phone}
        ci={ci}
        gender={gender}
        errors={errors}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
        onPhoneChange={handlePhoneChange}
        onCiChange={setCi}
        onGenderChange={setGender}
        companyCountry={companyCountry}
      />

      <OwnerActions onBack={onBack} isPending={isPending} />
    </form>
  );
}
