"use client";

import { useState, useEffect } from "react";
import { CompanyActions } from "./CompanyActions";
import { saveOnboardingData } from "@/services/auth/company-registration/onboarding/session";
import { CompanyFields } from "./CompanyFields";
import { useCompanyForm } from "@/components/auth/company/hooks/useCompanyForm";
import { validateCompanyNameAction } from "@/services/auth/company-registration/onboarding-actions";

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
  onBack = () => {},
}: CompanyNameFormProps & { onBack?: () => void }) {
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
    // keep local form errors in sync with hook errors, but preserve server validation errors
    setErrors((prevErrors) => ({
      ...formErrors,
      // Preserve server validation errors that aren't in formErrors
      name: formErrors?.name || prevErrors.name,
      country: formErrors?.country || prevErrors.country,
      phone: formErrors?.phone || prevErrors.phone,
      openedAt: formErrors?.openedAt || prevErrors.openedAt,
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use hook validation
    const isValid = validateForm();
    if (!isValid) return;

    // Extra phone validity checks based on PhoneInput
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

    // Validate company name uniqueness
    setIsPending(true);
    try {
      console.log("Frontend: Validating company name:", name);
      const result = await validateCompanyNameAction(name);
      console.log("Frontend: Validation result:", result);

      if (!result.success) {
        setErrors((prev) => ({
          ...prev,
          name: "Error al validar el nombre de la empresa",
        }));
        return;
      }

      if (!result.isAvailable) {
        console.log("Frontend: Company name not available, setting error");
        setErrors((prev) => ({
          ...prev,
          name: "Ya existe una empresa con ese nombre",
        }));
        return;
      }

      console.log("Frontend: Company name is available, proceeding");
      onNext?.();
    } finally {
      setIsPending(false);
    }
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

      <CompanyActions onBack={onBack} isPending={isPending} />
    </form>
  );
}
