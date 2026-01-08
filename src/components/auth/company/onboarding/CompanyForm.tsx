"use client";

import { useEffect, useState } from "react";
import { saveOnboardingData } from "@/services/auth/company-registration/onboarding/session";
import { CompanyFields } from "./CompanyFields";
import { useCompanyForm } from "@/components/auth/company/hooks/useCompanyForm";
import { CompanyActions } from "./CompanyActions";

interface CompanyFormProps {
  initialData?: {
    name: string;
    country: string;
    phone: string;
    department?: string;
    commerceType?: string;
    description?: string;
    vision?: string;
    mission?: string;
    openedAt?: string;
  };
  onDataChange?: (data: {
    name: string;
    country: string;
    phone: string;
    department?: string;
    commerceType?: string;
    description?: string;
    vision?: string;
    mission?: string;
    openedAt?: string;
  }) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export function CompanyForm({
  initialData = { name: "", country: "", phone: "" },
  onDataChange,
  onNext = () => {},
  onBack = () => {},
}: CompanyFormProps) {
  const [isPending, setIsPending] = useState(false);
  const {
    name,
    country,
    phone,
    department,
    commerceType,
    openedAt,
    errors: formErrors,
    setName,
    setCountry,
    setPhone,
    setDepartment,
    setCommerceType,
    setOpenedAt,
    validateForm,
  } = useCompanyForm(initialData);

  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [phonePlaceholder, setPhonePlaceholder] =
    useState<string>("59112345678");

  const [errors, setErrors] = useState(formErrors || {});

  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        name,
        country,
        phone,
        department,
        commerceType,
        openedAt,
      });
    }
    saveOnboardingData({
      company: {
        name,
        country,
        phone,
        department,
        commerceType,
        openedAt,
      },
    });
    setErrors(formErrors || {});
  }, [
    name,
    country,
    phone,
    department,
    commerceType,
    openedAt,
    onDataChange,
    formErrors,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Use validation from the hook
    const isValid = validateForm();
    if (!isValid) return;

    // extra phone validation from PhoneInput
    if (phoneValid === false) {
      setErrors((prev) => ({
        ...prev,
        phone: "El celular tiene formato inválido para el país seleccionado",
      }));
      return;
    } else if (!phoneValid && phone.replace(/\D/g, "").length < 8) {
      setErrors((prev) => ({
        ...prev,
        phone: "El celular debe tener al menos 8 dígitos",
      }));
      return;
    }

    setIsPending(true);
    onNext?.();
    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CompanyFields
        name={name}
        setName={setName}
        country={country}
        setCountry={setCountry}
        phone={phone}
        setPhone={setPhone}
        phoneValid={phoneValid}
        setPhoneValid={setPhoneValid}
        department={department}
        setDepartment={setDepartment}
        phonePlaceholder={phonePlaceholder}
        setPhonePlaceholder={setPhonePlaceholder}
        commerceType={commerceType}
        setCommerceType={setCommerceType}
        openedAt={openedAt}
        setOpenedAt={setOpenedAt}
        errors={errors}
      />

      <CompanyActions onBack={onBack} isPending={isPending} />
    </form>
  );
}
