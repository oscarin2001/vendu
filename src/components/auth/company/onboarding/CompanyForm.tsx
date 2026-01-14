"use client";

import { useEffect, useState } from "react";
import { saveOnboardingData } from "@/services/auth/company-registration/onboarding/session";
import { CompanyFields } from "./CompanyFields";
import { useCompanyForm } from "@/components/auth/company/hooks/useCompanyForm";
import { CompanyActions } from "./CompanyActions";
import { validateCompanyNameAction } from "@/services/auth/company-registration/onboarding-actions";
import { getPhoneMissingDigitsMessage } from "@/services/admin/config";
import { ImmutableConfirmCheckbox } from "../shared/ImmutableConfirmCheckbox";
import { SlugPreview } from "../shared/SlugPreview";

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

  // Función pura para generar slug
  const generateSlug = (companyName: string): string => {
    return companyName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [phonePlaceholder, setPhonePlaceholder] =
    useState<string>("59112345678");
  const [forcePhoneValidation, setForcePhoneValidation] = useState(false);
  const [confirmImmutable, setConfirmImmutable] = useState(false);

  const [slugPreview, setSlugPreview] = useState("");
  const [validationStatus, setValidationStatus] = useState<
    "idle" | "loading" | "available" | "unavailable"
  >("idle");

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

    // Generar preview del slug en tiempo real
    if (name.trim()) {
      const slug = generateSlug(name);
      setSlugPreview(slug);
      // Reset validation status when name changes
      setValidationStatus("idle");
    } else {
      setSlugPreview("");
      setValidationStatus("idle");
    }
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

  const handleNameBlur = async () => {
    if (!name.trim() || name.trim().length < 2) return;

    setValidationStatus("loading");
    try {
      const result = await validateCompanyNameAction(name);
      if (result.success) {
        setValidationStatus(result.isAvailable ? "available" : "unavailable");
      } else {
        setValidationStatus("unavailable");
      }
    } catch (error) {
      setValidationStatus("unavailable");
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    // Remove any existing phone error when user starts typing
    setErrors((prev) => (prev.phone ? { ...prev, phone: undefined } : prev));
  };

  const handlePhoneValidChange = (valid: boolean) => {
    setPhoneValid(valid);
    if (valid) {
      setErrors((prev) => (prev.phone ? { ...prev, phone: undefined } : prev));
      setForcePhoneValidation(false);
    } else {
      setForcePhoneValidation(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use validation from the hook
    const isValid = validateForm();
    if (!isValid) return;

    // Verificar confirmación de campos inmutables
    if (!confirmImmutable) {
      setErrors((prev) => ({
        ...prev,
        confirm: "Debes confirmar que el nombre de la empresa es correcto",
      }));
      return;
    }

    // extra phone validation from PhoneInput
    const phoneMessage = getPhoneMissingDigitsMessage(phone, country);
    if (phoneMessage) {
      setForcePhoneValidation(true);
      setErrors((prev) => ({ ...prev, phone: phoneMessage }));
      return;
    }

    if (phoneValid === false) {
      setForcePhoneValidation(true);
      setErrors((prev) => ({
        ...prev,
        phone: "El celular tiene formato inválido para el país seleccionado",
      }));
      return;
    }

    // Validate company name uniqueness
    setIsPending(true);
    try {
      const result = await validateCompanyNameAction(name);

      if (!result.success) {
        setErrors((prev) => ({
          ...prev,
          name: "Error al validar el nombre de la empresa",
        }));
        return;
      }

      if (!result.isAvailable) {
        setErrors((prev) => ({
          ...prev,
          name: "Ya existe una empresa con ese nombre",
        }));
        return;
      }

      onNext?.();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CompanyFields
        name={name}
        setName={setName}
        country={country}
        setCountry={setCountry}
        phone={phone}
        setPhone={handlePhoneChange}
        phoneValid={phoneValid}
        setPhoneValid={handlePhoneValidChange}
        forcePhoneValidation={forcePhoneValidation}
        department={department}
        setDepartment={setDepartment}
        phonePlaceholder={phonePlaceholder}
        setPhonePlaceholder={setPhonePlaceholder}
        commerceType={commerceType}
        setCommerceType={setCommerceType}
        openedAt={openedAt}
        setOpenedAt={setOpenedAt}
        errors={errors}
        onNameBlur={handleNameBlur}
      />

      <SlugPreview slug={slugPreview} status={validationStatus} />

      <ImmutableConfirmCheckbox
        checked={confirmImmutable}
        onCheckedChange={setConfirmImmutable}
        label="Confirmo que el nombre de la empresa es correcto y entiendo que se convertirá en mi URL única de acceso (ej. vendu.com/mi-empresa)."
      />

      <CompanyActions
        onBack={onBack}
        isPending={isPending}
        showBackButton={false}
        disabled={!confirmImmutable}
      />
    </form>
  );
}
