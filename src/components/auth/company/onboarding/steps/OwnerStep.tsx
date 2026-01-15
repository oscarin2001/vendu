"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, parseISOToLocalDate, formatPhonePattern } from "@/lib/utils";
import { getCountryConfigByName } from "@/services/admin/config";
import { saveOnboardingData } from "@/services/auth/company-registration/onboarding/session";
import { getPhoneMissingDigitsMessage } from "@/services/admin/config";

interface OwnerStepProps {
  initialData?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    ci?: string;
    gender?: string;
    birthDate?: string;
    joinedAt?: string;
  };
  companyCountry?: string;
  onDataChange?: (data: any) => void;
  onNext?: () => void;
  onBack?: () => void;
}

const GENDERS = ["Masculino", "Femenino", "Otro"];

export function OwnerStep({
  initialData = {},
  companyCountry,
  onDataChange,
  onNext = () => {},
  onBack = () => {},
}: OwnerStepProps) {
  const [firstName, setFirstName] = useState(initialData.firstName || "");
  const [lastName, setLastName] = useState(initialData.lastName || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [ci, setCi] = useState(initialData.ci || "");
  const [gender, setGender] = useState(initialData.gender || "");
  const [birthDate, setBirthDate] = useState(initialData.birthDate || "");
  const [joinedAt, setJoinedAt] = useState(initialData.joinedAt || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const countryConfig = getCountryConfigByName(companyCountry);

  useEffect(() => {
    const data = {
      firstName,
      lastName,
      phone,
      ci,
      gender,
      birthDate,
      joinedAt,
    };
    onDataChange?.(data);
    saveOnboardingData({
      owner: { ...data, country: companyCountry || "" } as any,
    });
  }, [
    firstName,
    lastName,
    phone,
    ci,
    gender,
    birthDate,
    joinedAt,
    onDataChange,
    companyCountry,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "Nombre requerido";
    if (!lastName.trim()) newErrors.lastName = "Apellido requerido";
    if (!phone.trim()) newErrors.phone = "Teléfono requerido";
    if (!ci.trim()) newErrors.ci = "CI/DNI requerido";
    if (!gender) newErrors.gender = "Selecciona género";

    const phoneMessage = getPhoneMissingDigitsMessage(
      phone,
      companyCountry || ""
    );
    if (phoneMessage) newErrors.phone = phoneMessage;
    if (phoneValid === false) newErrors.phone = "Teléfono inválido";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Nombre</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Juan"
          />
          {errors.firstName && (
            <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Pérez"
          />
          {errors.lastName && (
            <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Celular del responsable</Label>
        <PhoneInput
          value={phone}
          onChange={(val, valid) => {
            setPhone(val);
            setPhoneValid(valid);
          }}
          placeholder={
            countryConfig?.phone.format ??
            formatPhonePattern(countryConfig?.phone.local || 8)
          }
          required
          fixedCountryCode={countryConfig?.phone.prefix}
          fixedLocalMax={countryConfig?.phone.local}
          hideCountrySelect
          showValidation={!!phone}
        />
        {errors.phone && (
          <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ci">CI / DNI</Label>
          <Input
            id="ci"
            value={ci}
            onChange={(e) => setCi(e.target.value)}
            placeholder="12345678"
          />
          {errors.ci && (
            <p className="text-sm text-red-500 mt-1">{errors.ci}</p>
          )}
        </div>
        <div>
          <Label>Género</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="w-full rounded-md border px-3 py-2 text-left"
              >
                {gender || "Selecciona"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {GENDERS.map((g) => (
                <DropdownMenuItem key={g} onSelect={() => setGender(g)}>
                  {g}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {errors.gender && (
            <p className="text-sm text-red-500 mt-1">{errors.gender}</p>
          )}
        </div>
      </div>

      <div>
        <Label>Fecha de nacimiento (opcional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-2 justify-start text-left rounded-md border px-3 py-2",
                !birthDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {birthDate
                ? format(parseISOToLocalDate(birthDate) as Date, "dd/MM/yyyy", {
                    locale: es,
                  })
                : "Selecciona fecha"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              selected={birthDate ? parseISOToLocalDate(birthDate) : undefined}
              onSelect={(date) =>
                setBirthDate(date ? format(date, "yyyy-MM-dd") : "")
              }
              locale={es}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label>Fecha que se unió al equipo (opcional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-2 justify-start text-left rounded-md border px-3 py-2",
                !joinedAt && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {joinedAt
                ? format(parseISOToLocalDate(joinedAt) as Date, "dd/MM/yyyy", {
                    locale: es,
                  })
                : "Selecciona fecha"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              selected={joinedAt ? parseISOToLocalDate(joinedAt) : undefined}
              onSelect={(date) =>
                setJoinedAt(date ? format(date, "yyyy-MM-dd") : "")
              }
              locale={es}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button type="submit">Siguiente</Button>
      </div>
    </form>
  );
}
