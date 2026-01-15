"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import {
  saveOnboardingData,
  getOnboardingData,
} from "@/services/auth/company-registration/onboarding/session";

interface FiscalStepProps {
  initialData?: {
    taxId?: string;
    businessName?: string;
    fiscalAddress?: string;
    taxIdPath?: string;
  };
  onDataChange?: (data: any) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export function FiscalStep({
  initialData = {},
  onDataChange,
  onNext = () => {},
  onBack = () => {},
}: FiscalStepProps) {
  const [taxId, setTaxId] = useState(initialData.taxId || "");
  const [businessName, setBusinessName] = useState(
    initialData.businessName || ""
  );
  const [fiscalAddress, setFiscalAddress] = useState(
    initialData.fiscalAddress || ""
  );
  // Try to derive a sensible default for taxIdPath from the onboarding session
  const existingSession: any =
    typeof window !== "undefined" ? getOnboardingData() : {};
  let defaultTaxIdPath = initialData.taxIdPath || "";
  if (!defaultTaxIdPath) {
    if (
      existingSession &&
      existingSession.fiscal &&
      existingSession.fiscal.taxIdPath
    ) {
      defaultTaxIdPath = existingSession.fiscal.taxIdPath;
    } else if (
      existingSession &&
      existingSession.company &&
      existingSession.company.taxIdPath
    ) {
      defaultTaxIdPath = existingSession.company.taxIdPath;
    } else if (
      existingSession &&
      existingSession.company &&
      existingSession.company.slug
    ) {
      defaultTaxIdPath = `https://vendu.com/${existingSession.company.slug}`;
    }
  }

  const [taxIdPath, setTaxIdPath] = useState(defaultTaxIdPath || "");

  useEffect(() => {
    const data = { taxId, businessName, fiscalAddress, taxIdPath };
    onDataChange?.(data);
    const existing = getOnboardingData();
    saveOnboardingData({
      fiscal: data,
      company: { ...(existing.company || {}), taxId, taxIdPath } as any,
    });
  }, [taxId, businessName, fiscalAddress, taxIdPath, onDataChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
        Todos estos campos son <strong>opcionales</strong>. Puedes completarlos
        después en la configuración.
      </p>

      <div>
        <Label htmlFor="taxId">NIT / RUC</Label>
        <Input
          id="taxId"
          value={taxId}
          onChange={(e) => setTaxId(e.target.value)}
          placeholder="123456789 (opcional)"
        />
      </div>

      <div>
        <Label htmlFor="businessName">Razón Social</Label>
        <Input
          id="businessName"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Mi Empresa S.R.L. (opcional)"
        />
      </div>

      <div>
        <Label htmlFor="taxIdPath">URL / Ruta fiscal (opcional)</Label>
        <Input
          id="taxIdPath"
          value={taxIdPath}
          onChange={(e) => setTaxIdPath(e.target.value)}
          placeholder="https://mi-firma-o-facturacion/empresa/123 (opcional)"
        />
      </div>

      <div>
        <Label htmlFor="fiscalAddress">Dirección Fiscal</Label>
        <Input
          id="fiscalAddress"
          value={fiscalAddress}
          onChange={(e) => setFiscalAddress(e.target.value)}
          placeholder="Calle Principal #123 (opcional)"
        />
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button type="submit">Siguiente</Button>
      </div>
    </form>
  );
}
