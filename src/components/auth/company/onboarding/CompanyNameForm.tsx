"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { saveOnboardingData } from "@/services/auth/company-registration/onboarding/session";
import { CompanyFields } from "./CompanyFields";
import { useCompanyForm } from "@/components/auth/company/hooks/useCompanyForm";

interface CompanyNameFormProps {
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
}

export function CompanyNameForm({
  initialData = { name: "", country: "", phone: "" },
  onDataChange,
  onNext = () => {},
}: CompanyNameFormProps) {
  const [isPending, setIsPending] = useState(false);
  // use the new hook to manage company fields
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
    getFormData,
  } = useCompanyForm(initialData);

  const [description, setDescription] = useState<string | undefined>(
    initialData.description || ""
  );
  const [vision, setVision] = useState<string | undefined>(
    initialData.vision || ""
  );
  const [mission, setMission] = useState<string | undefined>(
    initialData.mission || ""
  );
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [phonePlaceholder, setPhonePlaceholder] =
    useState<string>("59112345678");

  // smaller render by delegating to subcomponents
  const [errors, setErrors] = useState<{
    name?: string;
    country?: string;
    phone?: string;
    openedAt?: string;
  }>(formErrors || {});

  // Save data whenever it changes (persist onboarding session)
  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        name,
        country,
        phone,
        department,
        commerceType,
        description,
        vision,
        mission,
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
        description,
        vision,
        mission,
        openedAt,
      },
    });
    // keep local form errors in sync with hook errors
    setErrors(formErrors || {});
  }, [
    name,
    country,
    phone,
    department,
    commerceType,
    description,
    vision,
    mission,
    openedAt,
    onDataChange,
    formErrors,
  ]);

  const validateForm = () => {
    const newErrors: {
      name?: string;
      country?: string;
      phone?: string;
      openedAt?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "El nombre de la empresa es requerido";
    } else if (name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!country) {
      newErrors.country = "Debe seleccionar un país";
    }

    if (!phone.trim()) {
      newErrors.phone = "El celular es requerido";
    } else if (phoneValid === false) {
      // if we know the phone is invalid from PhoneInput, show message
      newErrors.phone =
        "El celular tiene formato inválido para el país seleccionado";
    } else if (!phoneValid && phone.replace(/\D/g, "").length < 8) {
      // fallback
      newErrors.phone = "El celular debe tener al menos 8 dígitos";
    }

    if (!openedAt) {
      newErrors.openedAt = "Indica la fecha de apertura física";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsPending(true);
    onNext?.();
    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Siguiente"}
        </Button>
      </div>
    </form>
  );
}
