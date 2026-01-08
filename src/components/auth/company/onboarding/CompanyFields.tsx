"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/phone-input";
import { CountrySelect } from "@/components/ui/country-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCountryConfigByName } from "@/services/admin/config/countries";
import { COUNTRIES as PHONE_COUNTRIES } from "@/components/ui/phone-input";
import { cn } from "@/lib/utils";
import type { CompanyFormErrors } from "@/components/auth/company/hooks/useCompanyForm";
import { COMMERCE_TYPES } from "@/services/auth/company-registration/onboarding/constants";

interface CompanyFieldsProps {
  name: string;
  setName: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  phoneValid?: boolean | null;
  setPhoneValid?: (v: boolean) => void;
  department?: string;
  setDepartment?: (v: string) => void;
  phonePlaceholder?: string;
  setPhonePlaceholder?: (v: string) => void;
  commerceType?: string;
  setCommerceType?: (v: string) => void;
  openedAt?: string;
  setOpenedAt?: (v: string) => void;
  errors?: CompanyFormErrors;
}

export function CompanyFields({
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
  commerceType,
  setCommerceType,
  openedAt,
  setOpenedAt,
  errors = {},
}: CompanyFieldsProps) {
  const countryConfig = getCountryConfigByName(country);
  const departments = countryConfig?.departments ?? [];

  // default commerce types fallback to COMMERCE_TYPES
  const commerceOptions = COMMERCE_TYPES;
  const handleCountryChange = (val: string | null) => {
    const next = val || "";
    setCountry(next);
    const found = PHONE_COUNTRIES.find(
      (c) =>
        c.name
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase() ===
        next
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase()
    );
    if (found) {
      setPhonePlaceholder?.(`${found.code}${"7".repeat(found.local)}`);
      if (!phone) setPhone(found.code);
    }
  };

  const handleDepartmentSelect = (value: string) => {
    setDepartment?.(value);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <Field>
          <FieldLabel htmlFor="name">Nombre de la empresa</FieldLabel>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rous Boutique"
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="country">País</FieldLabel>
          <CountrySelect
            value={country}
            onChange={(val) => handleCountryChange(val ?? "")}
            placeholder="Bolivia"
          />
          {errors.country && <p className="text-sm text-red-600 mt-1">{errors.country}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Celular</FieldLabel>
          <PhoneInput
            value={phone}
            onChange={(val: string, valid: boolean) => {
              setPhone(val);
              setPhoneValid?.(valid);
            }}
            placeholder={countryConfig?.phone.example ?? phonePlaceholder}
            required
            showValidation
            fixedCountryCode={countryConfig?.phone.prefix}
            fixedLocalMax={countryConfig?.phone.local}
            hideCountrySelect={!!countryConfig}
          />
          {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
        </Field>

        {departments.length > 0 && (
          <Field>
            <FieldLabel htmlFor="department">Departamento</FieldLabel>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full rounded-md border px-3 py-2 text-left"
                >
                  {department || "Selecciona un departamento"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {departments.map((d) => (
                  <DropdownMenuItem key={d} onSelect={() => handleDepartmentSelect(d)}>
                    {d}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="openedAt">Fecha de apertura física</FieldLabel>
          {/* The calendar popover is re-used from the old component */}
          <div className="flex">
            <input
              id="openedAt"
              value={openedAt ?? ""}
              onChange={(e) => setOpenedAt?.(e.target.value)}
              placeholder="yyyy-mm-dd"
              className="w-full h-12 rounded-md border px-3"
            />
          </div>
          {errors.openedAt && <p className="text-sm text-red-600 mt-1">{errors.openedAt}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="commerceType">Tipo de comercio</FieldLabel>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="w-full rounded-md border px-3 py-2 text-left"
              >
                {commerceType || "Selecciona el tipo"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {COMMERCE_TYPES.map((option) => (
                <DropdownMenuItem key={option} onSelect={() => setCommerceType?.(option)}>
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </Field>
      </div>
    </>
  );
}
