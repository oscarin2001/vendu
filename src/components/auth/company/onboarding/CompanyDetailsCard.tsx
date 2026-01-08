"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/Button";
import { CountrySelect } from "@/components/ui/country-select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PhoneInput,
  COUNTRIES as PHONE_COUNTRIES,
} from "@/components/ui/phone-input";
import { getCountryConfigByName } from "@/services/admin/config/countries";
import { COMMERCE_TYPES } from "@/services/auth/company-registration/onboarding/constants";
import { cn } from "@/lib/utils";

interface CompanyDetailsCardProps {
  name: string;
  setName: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  phoneValid: boolean | null;
  setPhoneValid: (v: boolean) => void;
  department?: string;
  setDepartment: (v: string) => void;
  phonePlaceholder: string;
  setPhonePlaceholder: (v: string) => void;
  commerceType?: string;
  setCommerceType: (v: string) => void;
  description?: string;
  setDescription: (v: string) => void;
  vision?: string;
  setVision: (v: string) => void;
  mission?: string;
  setMission: (v: string) => void;
  openedAt?: string;
  setOpenedAt: (v: string) => void;
  openedAtError?: string;
}

export default function CompanyDetailsCard({
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
  description,
  setDescription,
  vision,
  setVision,
  mission,
  setMission,
  openedAt,
  setOpenedAt,
  openedAtError,
}: CompanyDetailsCardProps) {
  const parsedOpenedAt = openedAt ? new Date(openedAt) : undefined;
  const countryConfig = getCountryConfigByName(country);
  const departments = countryConfig?.departments ?? [];

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
      setPhonePlaceholder(`${found.code}${"7".repeat(found.local)}`);
      if (!phone) setPhone(found.code);
    }
  };

  const handleDepartmentSelect = (value: string) => {
    setDepartment(value);
  };

  return (
    <div className="space-y-4 rounded-xl border p-4 shadow-sm bg-card">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="name">Nombre de la empresa</FieldLabel>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rous Boutique"
            className="w-full h-12 rounded-md border px-3"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="country">País</FieldLabel>
          <CountrySelect
            value={country}
            onChange={(val) => handleCountryChange(val ?? "")}
            placeholder="Bolivia"
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
              countryConfig?.phone.example ?? phonePlaceholder ?? "59112345678"
            }
            required
            showValidation
            fixedCountryCode={countryConfig?.phone.prefix}
            fixedLocalMax={countryConfig?.phone.local}
            hideCountrySelect={!!countryConfig}
          />
        </Field>

        {departments.length > 0 && (
          <Field>
            <FieldLabel htmlFor="department">Departamento</FieldLabel>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full justify-between"
                >
                  {department || "Selecciona un departamento"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {departments.map((d) => (
                  <DropdownMenuItem
                    key={d}
                    onSelect={() => handleDepartmentSelect(d)}
                  >
                    {d}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="openedAt">Fecha de apertura física</FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                type="button"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !openedAt && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {openedAt && parsedOpenedAt
                  ? format(parsedOpenedAt, "dd/MM/yyyy")
                  : "Selecciona la fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={parsedOpenedAt}
                onSelect={(date) =>
                  setOpenedAt(date ? format(date, "yyyy-MM-dd") : "")
                }
                locale={es}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {openedAtError && (
            <p className="text-sm text-red-500 mt-1">{openedAtError}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="commerceType">Tipo de comercio</FieldLabel>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                type="button"
                className="w-full justify-between"
              >
              {commerceType || "Selecciona el tipo"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            {COMMERCE_TYPES.map((option) => (
              <DropdownMenuItem
                key={option}
                onSelect={() => setCommerceType(option)}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
          </DropdownMenu>
        </Field>
      </div>

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
    </div>
  );
}
