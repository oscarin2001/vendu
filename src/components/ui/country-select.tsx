"use client";

import React from "react";
import { Button } from "./Button";
import { Label } from "./label";
import { ChevronDown, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown-menu";

export type Country = { name: string; flag: string };

const COUNTRIES: Country[] = [
  { name: "Bolivia", flag: "🇧🇴" },
  { name: "Honduras", flag: "🇭🇳" },
  { name: "Guatemala", flag: "🇬🇹" },
  { name: "Nicaragua", flag: "🇳🇮" },
  { name: "Perú", flag: "🇵🇪" },
  { name: "Ecuador", flag: "🇪🇨" },
];

export function CountrySelect({
  value,
  onChange,
  placeholder = "Selecciona un país",
  className = "",
}: {
  value?: string;
  onChange?: (val?: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const selected = COUNTRIES.find((c) => c.name === value);

  return (
    <div className={className}>
      <Label className="mb-2 flex items-center gap-2">
        <MapPin size={16} />
        País
      </Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-12 px-4 transition-all duration-200 hover:border-primary/50"
          >
            <div className="flex items-center gap-3">
              {selected ? (
                <>
                  <span className="text-lg">{selected.flag}</span>
                  <span className="font-medium">{selected.name}</span>
                </>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronDown size={16} className="text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-80 max-h-64 overflow-y-auto">
          {COUNTRIES.map((c) => (
            <DropdownMenuItem
              key={c.name}
              onClick={() => onChange?.(c.name)}
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent transition-colors"
            >
              <span className="text-lg">{c.flag}</span>
              <span className="font-medium">{c.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function CountrySelectForm({
  onCountrySelect,
  className = "",
}: {
  onCountrySelect?: (country: string) => void;
  className?: string;
}) {
  const [selectedCountry, setSelectedCountry] = React.useState<string>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCountry) {
      onCountrySelect?.(selectedCountry);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <CountrySelect
        value={selectedCountry}
        onChange={setSelectedCountry}
        placeholder="Selecciona tu país"
      />
      <Button type="submit" className="w-full" disabled={!selectedCountry}>
        Continuar
      </Button>
    </form>
  );
}

export { COUNTRIES };
