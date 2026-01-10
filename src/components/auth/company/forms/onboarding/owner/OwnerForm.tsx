"use client";

import { useTransition } from "react";
import { OwnerFields } from "./components/OwnerFields";
import { OwnerActions } from "./components/OwnerActions";
import { useOwnerForm, OwnerFormData } from "./hooks/useOwnerForm";
import { saveOwnerData } from "@/services/auth/company-registration/onboarding/actions";
import { saveOnboardingData } from "@/services/auth/company-registration/onboarding/session";
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
    birthDate: "",
    joinedAt: "",
    contractEndAt: "",
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
    birthDate,
    joinedAt,
    contractEndAt,
    country,
    errors,
    setFirstName,
    setLastName,
    setPhone,
    setCi,
    setGender,
    setBirthDate,
    setJoinedAt,
    setContractEndAt,
    setCountry,
    setErrors,
    handlePhoneChange,
    validateForm,
    getFormData,
  } = useOwnerForm(initialData, onDataChange, companyCountry);

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
      saveOnboardingData({ owner: data });
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
        birthDate={birthDate}
        joinedAt={joinedAt}
        contractEndAt={contractEndAt}
        errors={errors}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
        onPhoneChange={handlePhoneChange}
        onCiChange={setCi}
        onGenderChange={setGender}
        onBirthDateChange={setBirthDate}
        onJoinedAtChange={setJoinedAt}
        onContractEndAtChange={setContractEndAt}
        companyCountry={companyCountry}
      />

      <OwnerActions onBack={onBack} isPending={isPending} />
    </form>
  );
}
