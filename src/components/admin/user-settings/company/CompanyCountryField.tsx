"use client";

import { useMemo } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { COUNTRIES } from "@/components/ui/country-select";
import { Lock, AlertTriangle } from "lucide-react";

interface CompanyCountryFieldProps {
  value: string;
  onSelect: (country: string) => void;
  disabled?: boolean;
  error?: string;
}

/**
 * Campo de país BLOQUEADO después del onboarding.
 * El país define moneda, impuestos, reportes e integraciones.
 * Cambiarlo rompería la contabilidad histórica.
 */
export function CompanyCountryField({
  value,
  error,
}: CompanyCountryFieldProps) {
  const selected = useMemo(
    () => COUNTRIES.find((country) => country.name === value),
    [value]
  );

  return (
    <Field>
      <div className="flex items-center gap-2">
        <FieldLabel>País</FieldLabel>
        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="w-full h-12 px-4 flex items-center justify-between rounded-md border bg-muted/50 cursor-not-allowed">
        <div className="flex items-center gap-3">
          {selected ? (
            <>
              <span className="text-lg">{selected.flag}</span>
              <span className="font-medium">{selected.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Sin país configurado</span>
          )}
        </div>
        <Lock className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-600">
        <AlertTriangle className="h-3.5 w-3.5" />
        <span>
          El país no puede cambiarse (afecta contabilidad, impuestos y reportes)
        </span>
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </Field>
  );
}
