"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field, FieldLabel } from "@/components/ui/field";
import { saveOnboardingData, getOnboardingData } from "@/services/auth/company-registration/onboarding/session";

interface FiscalFormProps {
  initialData?: { taxId: string; businessName: string; fiscalAddress: string };
  onBack?: () => void;
  onDataChange?: (data: {
    taxId: string;
    businessName: string;
    fiscalAddress: string;
  }) => void;
  onNext?: () => void;
}

export function FiscalForm({
  initialData = { taxId: "", businessName: "", fiscalAddress: "" },
  onBack = () => {},
  onDataChange,
  onNext = () => {},
}: FiscalFormProps) {
  const [taxId, setTaxId] = useState(initialData.taxId || "");
  const [businessName, setBusinessName] = useState(
    initialData.businessName || ""
  );
  const [fiscalAddress, setFiscalAddress] = useState(
    initialData.fiscalAddress || ""
  );
  const [errors, setErrors] = useState<{
    taxId?: string;
    businessName?: string;
    fiscalAddress?: string;
  }>({});

  // Save data whenever it changes (persist onboarding session)
  useEffect(() => {
    if (onDataChange) {
      onDataChange({ taxId, businessName, fiscalAddress });
    }
    // merge into existing company data in session
    const existing = getOnboardingData();
    saveOnboardingData({
      company: { ...(existing.company || {}), taxId } as any,
    });
  }, [taxId, onDataChange]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Fiscal data is optional, so no validation required
    // But if any field is filled, we could validate format, but for now, keep simple

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="taxId">NIT / RUC</FieldLabel>
        <Input
          id="taxId"
          value={taxId}
          onChange={(e) => setTaxId(e.target.value)}
          placeholder="123456789"
        />
        {errors.taxId && (
          <p className="text-sm text-red-600 mt-1">{errors.taxId}</p>
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="businessName">Razón social</FieldLabel>
        <Input
          id="businessName"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Mi Empresa S.A."
        />
        {errors.businessName && (
          <p className="text-sm text-red-600 mt-1">{errors.businessName}</p>
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="fiscalAddress">Dirección fiscal</FieldLabel>
        <Input
          id="fiscalAddress"
          value={fiscalAddress}
          onChange={(e) => setFiscalAddress(e.target.value)}
          placeholder="Calle Fiscal 789"
        />
        {errors.fiscalAddress && (
          <p className="text-sm text-red-600 mt-1">{errors.fiscalAddress}</p>
        )}
      </Field>

      <div className="flex space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Atrás
        </Button>
        <Button type="submit" className="flex-1">
          Siguiente
        </Button>
      </div>
    </form>
  );
}
