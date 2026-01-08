"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import CompanyLegalAcceptance from "./CompanyLegalAcceptance";
import { toast } from "sonner";
import { createCompanyAction } from "@/services/auth/company-registration/onboarding-actions";

interface LegalStepProps {
  companyData: {
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
  initialData?: { tosAccepted?: boolean; tosRead?: boolean };
  onNext?: (data?: any) => void;
  onBack?: () => void;
  onDataChange?: (data: { tosAccepted: boolean; tosRead: boolean }) => void;
}

export function LegalStep({
  companyData,
  initialData,
  onNext,
  onBack,
  onDataChange,
}: LegalStepProps) {
  const [tosAccepted, setTosAccepted] = useState(!!initialData?.tosAccepted);
  const [tosRead, setTosRead] = useState(!!initialData?.tosRead);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onDataChange?.({ tosAccepted, tosRead });
  }, [tosAccepted, tosRead, onDataChange]);

  const validate = () => {
    if (!companyData.name || !companyData.country || !companyData.phone) {
      setError(
        "Faltan datos de la empresa: nombre, país y celular son obligatorios"
      );
      return false;
    }
    if (!companyData.openedAt) {
      setError("Agrega la fecha de apertura antes de continuar");
      return false;
    }
    if (!tosRead) {
      setError("Debes leer los Términos y la Política antes de continuar");
      return false;
    }
    if (!tosAccepted) {
      setError(
        "Debes aceptar los Términos de Uso y la Política de Uso Aceptable"
      );
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsPending(true);
    try {
      const payload = {
        ...companyData,
        tosAccepted,
        tosRead,
      };

      const result = await createCompanyAction(payload);

      if (!result.success) {
        setError(result.error || "No pudimos guardar la aceptación legal");
        return;
      }

      toast.success("¡Empresa registrada exitosamente!");
      onNext?.({ tosAccepted, tosRead });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CompanyLegalAcceptance
        tosAccepted={tosAccepted}
        setTosAccepted={setTosAccepted}
        tosRead={tosRead}
        setTosRead={setTosRead}
        companyName={companyData.name}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Continuar"}
        </Button>
      </div>
    </form>
  );
}
