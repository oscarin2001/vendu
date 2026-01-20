"use client";

import React, { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { CountrySelect } from "@/components/ui/country-select";
import {
  PhoneInput,
  COUNTRIES as PHONE_COUNTRIES,
} from "@/components/ui/phone-input";
import {
  getCountryConfigByName,
  filterPhoneFirstDigit,
  getPhoneStartDigitsHint,
  validatePhoneByCountry,
} from "@/services/admin/config";

export default function CompanyContactFields({
  name,
  setName,
  country,
  setCountry,
  phone,
  setPhone,
  phoneValid,
  setPhoneValid,
  department,
  setDepartment,
  phonePlaceholder,
  setPhonePlaceholder,
}: any) {
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handlePhoneChange = (val: string, valid: boolean) => {
    const config = getCountryConfigByName(country);
    const prefix = config?.phone.prefix ?? "";

    // Extraer solo dígitos locales
    let digits = val.replace(/\D/g, "");
    let localDigits = digits;
    if (prefix && digits.startsWith(prefix)) {
      localDigits = digits.slice(prefix.length);
    }

    // Filtrar primer dígito si no es válido para el país
    if (country && localDigits.length > 0) {
      const filtered = filterPhoneFirstDigit(localDigits, country);
      if (filtered !== localDigits) {
        // El primer dígito era inválido, reconstruir el valor
        const newVal = prefix ? prefix + filtered : filtered;
        setPhone(newVal);
        setPhoneValid(false);
        const error = validatePhoneByCountry(newVal, country);
        setPhoneError(error);
        return;
      }
    }

    setPhone(val);
    setPhoneValid(valid);

    // Validar y mostrar error
    if (country && localDigits.length > 0) {
      const error = validatePhoneByCountry(val, country);
      setPhoneError(error);
    } else {
      setPhoneError(null);
    }
  };

  const phoneHint = country ? getPhoneStartDigitsHint(country) : null;

  return (
    <>
      <Field>
        <FieldLabel htmlFor="name">Nombre de la empresa</FieldLabel>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Mi Empresa S.A."
          className="w-full h-12 rounded-md border px-3 placeholder:text-sm"
        />
      </Field>

      <Field>
        <CountrySelect
          value={country}
          onChange={(val) => {
            setCountry(val || "");
            const cfg = getCountryConfigByName(val || "");
            if (cfg) {
              // Placeholder siempre XXXXXXXX
              setPhonePlaceholder("XXXXXXXX");
              if (!phone) setPhone(cfg.phone.prefix);
            }
            // Limpiar error al cambiar país
            setPhoneError(null);
          }}
          placeholder="Selecciona un país"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="phone">Celular</FieldLabel>
        <PhoneInput
          value={phone}
          onChange={handlePhoneChange}
          placeholder="XXXXXXXX"
          required
          showValidation
          fixedCountryCode={getCountryConfigByName(country)?.phone.prefix}
          fixedLocalMax={getCountryConfigByName(country)?.phone.local}
          hideCountrySelect={!!getCountryConfigByName(country)}
          showFormatHint={false}
        />
        {phoneHint && !phoneError && (
          <p className="text-xs text-muted-foreground mt-1">{phoneHint}</p>
        )}
        {phoneError && (
          <p className="text-sm text-red-500 mt-1">{phoneError}</p>
        )}
      </Field>

      {getCountryConfigByName(country)?.departments && (
        <Field>
          <FieldLabel htmlFor="department">Departamento</FieldLabel>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full h-12 rounded-md border px-3 placeholder:text-sm"
          >
            <option value="">Selecciona un departamento</option>
            {getCountryConfigByName(country)!.departments!.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>
      )}
    </>
  );
}
