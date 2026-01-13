"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  saveOnboardingData,
  getOnboardingData,
} from "@/services/auth/company-registration/onboarding/session";

interface FiscalFormProps {
  initialData?: {
    taxId?: string;
    businessName?: string;
    fiscalAddress?: string;
    taxIdPath?: string;
  };
  onBack?: () => void;
  onDataChange?: (data: {
    taxId?: string;
    businessName?: string;
    fiscalAddress?: string;
    taxIdPath?: string;
  }) => void;
  onNext?: () => void;
}

export function FiscalForm({
  initialData = {
    taxId: "",
    businessName: "",
    fiscalAddress: "",
    taxIdPath: "",
  },
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
  const [taxIdPath, setTaxIdPath] = useState(initialData.taxIdPath || "");
  const [errors, setErrors] = useState<{
    taxId?: string;
    businessName?: string;
    fiscalAddress?: string;
    taxIdPath?: string;
  }>({});

  // Save data whenever it changes (persist onboarding session)
  useEffect(() => {
    if (onDataChange) {
      onDataChange({ taxId, businessName, fiscalAddress, taxIdPath });
    }

    // Persist full fiscal data plus mirror taxId into company data for creation
    const existing = getOnboardingData();
    saveOnboardingData({
      fiscal: { taxId, businessName, fiscalAddress, taxIdPath },
      company: { ...(existing.company || {}), taxId, taxIdPath } as any,
    });
  }, [taxId, businessName, fiscalAddress, taxIdPath, onDataChange]);

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
      <p className="text-sm text-muted-foreground">
        Todos estos campos fiscales son opcionales. Ingresa la información si la
        tienes disponible.
      </p>
      <Field>
        <FieldLabel htmlFor="taxId">NIT / RUC</FieldLabel>
        <Input
          id="taxId"
          value={taxId}
          onChange={(e) => setTaxId(e.target.value)}
          placeholder="123456789 (opcional)"
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
          placeholder="Mi Empresa S.A. (opcional)"
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
          placeholder="Calle Fiscal 789 (opcional)"
        />
        {errors.fiscalAddress && (
          <p className="text-sm text-red-600 mt-1">{errors.fiscalAddress}</p>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="taxIdPath">Ruta del NIT</FieldLabel>
        <Input
          id="taxIdPath"
          value={taxIdPath}
          onChange={(e) => setTaxIdPath(e.target.value)}
          placeholder="https://tu-storage/nit.pdf (opcional)"
        />
        {errors.taxIdPath && (
          <p className="text-sm text-red-600 mt-1">{errors.taxIdPath}</p>
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
