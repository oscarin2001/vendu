"use client";

import React from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { CountrySelect } from "@/components/ui/country-select";
import {
  PhoneInput,
  COUNTRIES as PHONE_COUNTRIES,
} from "@/components/ui/phone-input";
import { getCountryConfigByName } from "@/services/admin/config/countries";

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
  return (
    <>
      <Field>
        <FieldLabel htmlFor="name">Nombre de la empresa</FieldLabel>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Mi Empresa S.A."
          className="w-full h-12 rounded-md border px-3"
        />
      </Field>

      <Field>
        <CountrySelect
          value={country}
          onChange={(val) => {
            setCountry(val || "");
            const cfg = getCountryConfigByName(val || "");
            if (cfg) {
              // prefer explicit format if present, otherwise build a simple placeholder
              const format = cfg.phone.format ?? `${"7".repeat(Math.max(3, cfg.phone.local - 1))}`;
              setPhonePlaceholder(format);
              if (!phone) setPhone(cfg.phone.prefix);
            }
          }}
          placeholder="Selecciona un país"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="phone">Celular</FieldLabel>
        <PhoneInput
          value={phone}
          onChange={(val: string, valid: boolean) => {
            setPhone(val);
            setPhoneValid(valid);
          }}
          placeholder={
            // show local-only format when country is selected to avoid confusion
            getCountryConfigByName(country)?.phone.format ?? phonePlaceholder
          }
          required
          showValidation
          fixedCountryCode={getCountryConfigByName(country)?.phone.prefix}
          fixedLocalMax={getCountryConfigByName(country)?.phone.local}
          hideCountrySelect={!!getCountryConfigByName(country)}
          showFormatHint={!!getCountryConfigByName(country)}
        />
      </Field>

      {getCountryConfigByName(country)?.departments && (
        <Field>
          <FieldLabel htmlFor="department">Departamento</FieldLabel>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full h-12 rounded-md border px-3"
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
