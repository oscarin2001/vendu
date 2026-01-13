"use client";

import { useMemo } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { COUNTRIES } from "@/components/ui/country-select";
import { ChevronDown } from "lucide-react";

interface CompanyCountryFieldProps {
  value: string;
  onSelect: (country: string) => void;
  disabled?: boolean;
  error?: string;
}

export function CompanyCountryField({
  value,
  onSelect,
  disabled = false,
  error,
}: CompanyCountryFieldProps) {
  const selected = useMemo(
    () => COUNTRIES.find((country) => country.name === value),
    [value]
  );

  return (
    <Field>
      <FieldLabel>Pais</FieldLabel>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between h-12 px-4"
            disabled={disabled}
          >
            <div className="flex items-center gap-3">
              {selected ? (
                <>
                  <span className="text-lg">{selected.flag}</span>
                  <span className="font-medium">{selected.name}</span>
                </>
              ) : (
                <span className="text-muted-foreground">
                  Selecciona un pais
                </span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-72 overflow-y-auto w-64">
          {COUNTRIES.map((country) => (
            <DropdownMenuItem
              key={country.name}
              onSelect={() => onSelect(country.name)}
              className="flex items-center gap-3"
            >
              <span className="text-lg">{country.flag}</span>
              <span className="font-medium">{country.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </Field>
  );
}
