"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { cn, parseISOToLocalDate } from "@/lib/utils";
import { COMMERCE_TYPES } from "@/services/auth/company-registration/onboarding/constants";
import {
  saveOnboardingData,
  getOnboardingData,
} from "@/services/auth/company-registration/onboarding/session";
import { getCountryConfigByName } from "@/services/admin/config";

interface DetailsStepProps {
  initialData?: {
    description?: string;
    commerceType?: string;
    openedAt?: string;
    department?: string;
  };
  companyCountry?: string;
  onDataChange?: (data: any) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export function DetailsStep({
  initialData = {},
  companyCountry,
  onDataChange,
  onNext = () => {},
  onBack = () => {},
}: DetailsStepProps) {
  const [description, setDescription] = useState(initialData.description || "");
  const [commerceType, setCommerceType] = useState(
    initialData.commerceType || ""
  );
  const [openedAt, setOpenedAt] = useState(initialData.openedAt || "");
  const [department, setDepartment] = useState(initialData.department || "");
  const [errors, setErrors] = useState<{
    openedAt?: string;
    commerceType?: string;
  }>({});

  const countryConfig = getCountryConfigByName(companyCountry);
  const departments = countryConfig?.departments ?? [];

  useEffect(() => {
    const data = { description, commerceType, openedAt, department };
    onDataChange?.(data);
    const existing = getOnboardingData();
    saveOnboardingData({
      company: { ...(existing.company || {}), ...data } as any,
    });
  }, [description, commerceType, openedAt, department, onDataChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!commerceType)
      newErrors.commerceType = "Selecciona el tipo de comercio";
    if (!openedAt) newErrors.openedAt = "Selecciona la fecha de apertura";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {countryConfig && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
          <span className="text-lg font-semibold">
            {countryConfig.currency.symbol}
          </span>
          <span className="text-sm text-muted-foreground">
            {countryConfig.currency.code} - Moneda configurada
          </span>
        </div>
      )}

      {departments.length > 0 && (
        <div>
          <Label>Departamento / Región</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="w-full rounded-md border px-3 py-2 text-left"
              >
                {department || "Selecciona departamento"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
              {departments.map((d) => (
                <DropdownMenuItem key={d} onSelect={() => setDepartment(d)}>
                  {d}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div>
        <Label htmlFor="commerceType">Tipo de comercio</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-full rounded-md border px-3 py-2 text-left"
            >
              {commerceType || "Selecciona el tipo"}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
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
        {errors.commerceType && (
          <p className="text-sm text-red-500 mt-1">{errors.commerceType}</p>
        )}
      </div>

      <div>
        <Label>Fecha de apertura física</Label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-2 justify-start text-left rounded-md border px-3 py-2",
                !openedAt && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {openedAt
                ? format(parseISOToLocalDate(openedAt) as Date, "dd/MM/yyyy", {
                    locale: es,
                  })
                : "Selecciona fecha"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              selected={openedAt ? parseISOToLocalDate(openedAt) : undefined}
              onSelect={(date) =>
                setOpenedAt(date ? format(date, "yyyy-MM-dd") : "")
              }
              locale={es}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.openedAt && (
          <p className="text-sm text-red-500 mt-1">{errors.openedAt}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Descripción breve (opcional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe brevemente tu negocio..."
          rows={3}
        />
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
