"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  saveOnboardingData,
  getOnboardingData,
} from "@/services/auth/company-registration/onboarding/session";
import { getCountryConfigByName } from "@/services/admin/config";

interface CompanyDescriptionFormProps {
  initialData?: {
    description?: string;
    vision?: string;
    mission?: string;
  };
  companyCountry?: string;
  onDataChange?: (data: {
    description?: string;
    vision?: string;
    mission?: string;
  }) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export function CompanyDescriptionForm({
  initialData = {},
  companyCountry,
  onDataChange,
  onNext = () => {},
  onBack = () => {},
}: CompanyDescriptionFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [description, setDescription] = useState(initialData.description || "");
  const [vision, setVision] = useState(initialData.vision || "");
  const [mission, setMission] = useState(initialData.mission || "");

  const countryConfig = getCountryConfigByName(companyCountry);

  useEffect(() => {
    const payload = { description, vision, mission };
    onDataChange?.(payload);
    // merge into existing company data in session
    const existing = getOnboardingData();
    saveOnboardingData({
      company: { ...(existing.company || {}), ...payload } as any,
    });
  }, [description, vision, mission, onDataChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      onNext?.();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {countryConfig && (
        <Field>
          <FieldLabel>Moneda del País</FieldLabel>
          <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
            <span className="text-lg font-semibold">
              {countryConfig.currency.symbol}
            </span>
            <span className="text-sm text-muted-foreground">
              {countryConfig.currency.code} - {countryConfig.currency.locale}
            </span>
          </div>
        </Field>
      )}

      <Field>
        <FieldLabel htmlFor="description">
          Descripción breve del comercio
        </FieldLabel>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border px-3 py-2 min-h-[80px]"
          maxLength={250}
          placeholder="Ej: Venta de ropa vintage y accesorios en mercados locales..."
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="vision">Visión (opcional)</FieldLabel>
        <textarea
          id="vision"
          value={vision}
          onChange={(e) => setVision(e.target.value)}
          className="w-full rounded-md border px-3 py-2 min-h-[60px]"
          maxLength={300}
          placeholder="Ser la plataforma líder regional para revendedores locales..."
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="mission">Misión (opcional)</FieldLabel>
        <textarea
          id="mission"
          value={mission}
          onChange={(e) => setMission(e.target.value)}
          className="w-full rounded-md border px-3 py-2 min-h-[60px]"
          maxLength={300}
          placeholder="Facilitar la gestión y venta a comercios informales para incrementar sus ingresos..."
        />
      </Field>

      <div className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => onBack?.()}>
          Atrás
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Siguiente"}
        </Button>
      </div>
    </form>
  );
}
