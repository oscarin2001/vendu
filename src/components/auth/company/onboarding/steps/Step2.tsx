"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PhoneInput } from "@/components/ui/phone-input";
import { CountrySelect } from "@/components/ui/country-select";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getCountryConfigByName,
  filterPhoneFirstDigit,
  getPhoneStartDigitsHint,
  validatePhoneByCountry,
} from "@/services/admin/config";
import { COUNTRIES as PHONE_COUNTRIES } from "@/components/ui/phone-input";

interface Step2Props {
  data: { country: string; phone: string; department: string };
  setData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2({ data, setData, onNext, onBack }: Step2Props) {
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const countryConfig = getCountryConfigByName(data.country);
  const departments = countryConfig?.departments ?? [];

  const handleCountryChange = (val: string | null) => {
    const next = val || "";
    setData({ ...data, country: next, department: "" });
    setPhoneTouched(false);
    const found = PHONE_COUNTRIES.find(
      (c) =>
        c.name
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase() ===
        next
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase(),
    );
    if (found) {
      if (!data.phone) setData({ ...data, phone: found.code, country: next });
    }
  };

  const handlePhoneChange = (value: string, valid: boolean) => {
    const config = getCountryConfigByName(data.country);
    const prefix = config?.phone.prefix ?? "";

    // Extraer dígitos locales sin prefijo
    let digits = value.replace(/\D/g, "");
    let localDigits = digits;
    if (prefix && digits.startsWith(prefix)) {
      localDigits = digits.slice(prefix.length);
    }

    // Filtrar primer dígito inválido en tiempo real
    if (data.country && localDigits.length > 0) {
      const filtered = filterPhoneFirstDigit(localDigits, data.country);
      if (filtered !== localDigits) {
        const newVal = prefix ? prefix + filtered : filtered;
        setData({ ...data, phone: newVal });
        setPhoneValid(false);
        const firstHint = getPhoneStartDigitsHint(data.country);
        setPhoneError(
          firstHint ??
            "El número debe comenzar con un dígito válido para el país",
        );
        if (!phoneTouched) setPhoneTouched(true);
        return;
      }
    }

    setData({ ...data, phone: value });
    const error =
      data.country && localDigits.length > 0
        ? validatePhoneByCountry(value, data.country)
        : null;
    setPhoneValid(!error && valid);
    if (!phoneTouched) setPhoneTouched(true);

    if (data.country && localDigits.length > 0) {
      setPhoneError(error);
    } else {
      setPhoneError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.country) {
      alert("Selecciona un país.");
      return;
    }
    if (!data.phone || phoneValid === false) {
      alert("Ingresa un teléfono válido.");
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Ubicación y Contacto</h2>
        <p className="text-muted-foreground">
          Configura tu ubicación y datos de contacto.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="country">País</Label>
          <CountrySelect
            value={data.country}
            onChange={(val) => handleCountryChange(val ?? "")}
            placeholder="Bolivia"
          />
        </div>

        <div>
          <Label htmlFor="phone">Celular</Label>
          <PhoneInput
            value={data.phone}
            onChange={handlePhoneChange}
            placeholder={"XXXXXXXX"}
            required
            fixedCountryCode={countryConfig?.phone.prefix}
            fixedLocalMax={countryConfig?.phone.local}
            hideCountrySelect
            showFormatHint={false}
            showValidation={false}
          />
          {phoneError && (
            <p className="text-sm text-red-500 mt-1">{phoneError}</p>
          )}
        </div>

        {departments.length > 0 && (
          <div>
            <Label htmlFor="department">Departamento</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full rounded-md border px-3 py-2 text-left"
                >
                  {data.department || "Selecciona un departamento"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {departments.map((d) => (
                  <DropdownMenuItem
                    key={d}
                    onSelect={() => setData({ ...data, department: d })}
                  >
                    {d}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button type="submit">Siguiente</Button>
      </div>
    </form>
  );
}
