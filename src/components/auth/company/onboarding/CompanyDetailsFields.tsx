"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { parseISOToLocalDate } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/Button";
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
import { COMMERCE_TYPES } from "@/services/auth/company-registration/onboarding/constants";
import { cn } from "@/lib/utils";

export default function CompanyDetailsFields({
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
}: any) {
  const parsedOpenedAt = openedAt ? parseISOToLocalDate(openedAt) : undefined;

  return (
    <>
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
              captionLayout="dropdown"
              selected={
                parsedOpenedAt
                  ? parsedOpenedAt
                  : new Date(new Date().getFullYear(), new Date().getMonth(), 18)
              }
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
    </>
  );
}
