"use client";

import { CompanyFormState } from "./types";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Building2, ChevronDown, Check, Coins, Lock, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompanyCountryField } from "./CompanyCountryField";
import { CompanyDepartmentField } from "./CompanyDepartmentField";

interface CompanyInfoSectionProps {
  data: CompanyFormState;
  expanded: boolean;
  countryError?: string;
  departmentError?: string;
  departmentOptions: string[];
  currencyLabel?: string;
  saving: boolean;
  canReset: boolean;
  onToggle: () => void;
  onFieldChange: (field: keyof CompanyFormState, value: string) => void;
  onCountrySelect: (country: string) => void;
  onDepartmentSelect: (department: string) => void;
  onReset: () => void;
  onSave: () => void;
  lastUpdatedHint?: string;
}

export function CompanyInfoSection({
  data,
  expanded,
  countryError,
  departmentError,
  departmentOptions,
  currencyLabel,
  saving,
  canReset,
  onToggle,
  onFieldChange,
  onCountrySelect,
  onDepartmentSelect,
  onReset,
  onSave,
  lastUpdatedHint,
}: CompanyInfoSectionProps) {
  return (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <span className="font-semibold text-lg">
              Informacion de la empresa
            </span>
            <p className="text-sm text-muted-foreground">
              Actualiza datos fiscales y regionales de tu compania
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 transition-transform duration-300",
            expanded ? "rotate-180" : ""
          )}
        />
      </button>

      {expanded && (
        <div className="p-6 bg-card border-t space-y-6">
          {/* Aviso de campos inmutables removed per request */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel className="flex items-center gap-2">
                Nombre
                <Lock className="h-3 w-3 text-muted-foreground" />
              </FieldLabel>
              <Input
                value={data.name}
                disabled
                className="bg-muted/50 cursor-not-allowed"
                placeholder="Nombre de la empresa"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Campo permanente definido en el registro
              </p>
            </Field>
            <Field>
              <FieldLabel>NIT</FieldLabel>
              <Input
                value={data.taxId}
                onChange={(event) => onFieldChange("taxId", event.target.value)}
                placeholder="123456789"
              />
            </Field>
            <Field>
              <FieldLabel>Razon social</FieldLabel>
              <Input
                value={data.businessName}
                onChange={(event) =>
                  onFieldChange("businessName", event.target.value)
                }
                placeholder="Razon social completa"
              />
            </Field>
            <Field>
              <FieldLabel>Direccion fiscal</FieldLabel>
              <Input
                value={data.fiscalAddress}
                onChange={(event) =>
                  onFieldChange("fiscalAddress", event.target.value)
                }
                placeholder="Direccion completa"
              />
            </Field>
            <CompanyCountryField
              value={data.country}
              onSelect={onCountrySelect}
              error={countryError}
            />
            <div className="space-y-2">
              <CompanyDepartmentField
                value={data.department}
                options={departmentOptions}
                onSelect={onDepartmentSelect}
                error={departmentError}
              />
              {currencyLabel && (
                <div className="flex items-center gap-2 rounded-md border bg-muted p-3 text-sm">
                  <Coins className="h-4 w-4 text-primary" />
                  <span>Moneda oficial: {currencyLabel}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              {lastUpdatedHint || "Ultima revision reciente"}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                disabled={!canReset}
              >
                Restablecer
              </Button>
              <Button
                size="sm"
                className="min-w-[150px]"
                onClick={onSave}
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
