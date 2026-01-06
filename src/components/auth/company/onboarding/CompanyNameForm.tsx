"use client";

import { useState, useEffect } from "react";
import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field, FieldLabel } from "@/components/ui/field";
import { CountrySelect } from "@/components/ui/country-select";
import { PhoneInput } from "@/components/ui/phone-input";
import { saveCompanyData } from "@/services/auth/company-registration/onboarding/actions";

interface CompanyNameFormProps {
  initialData?: { name: string; country: string; phone: string };
  onDataChange?: (data: {
    name: string;
    country: string;
    phone: string;
  }) => void;
  onNext?: () => void;
}

export function CompanyNameForm({
  initialData = { name: "", country: "", phone: "" },
  onDataChange,
  onNext = () => {},
}: CompanyNameFormProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialData.name || "");
  const [country, setCountry] = useState(initialData.country || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [errors, setErrors] = useState<{
    name?: string;
    country?: string;
    phone?: string;
  }>({});

  // Save data whenever it changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange({ name, country, phone });
    }
  }, [name, country, phone, onDataChange]);

  const validateForm = () => {
    const newErrors: { name?: string; country?: string; phone?: string } = {};

    if (!name.trim()) {
      newErrors.name = "El nombre de la empresa es requerido";
    } else if (name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!country) {
      newErrors.country = "Debe seleccionar un país";
    }

    if (!phone.trim()) {
      newErrors.phone = "El celular es requerido";
    } else if (phone.replace(/\D/g, "").length < 8) {
      newErrors.phone = "El celular debe tener al menos 8 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("country", country);
    formData.append("phone", phone);

    startTransition(async () => {
      const result = await saveCompanyData(formData);
      if (!result.success) {
        setErrors({ name: result.error });
        (await import("sonner")).toast.error(result.error);
        return;
      }
      onNext?.();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="name">Nombre de la empresa</FieldLabel>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Mi Empresa S.A."
          required
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name}</p>
        )}
      </Field>
      <Field>
        <CountrySelect
          value={country}
          onChange={(val) => setCountry(val || "")}
          placeholder="Selecciona un país"
        />
        {errors.country && (
          <p className="text-sm text-red-500 mt-1">{errors.country}</p>
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="phone">Celular</FieldLabel>
        <PhoneInput
          value={phone}
          onChange={(val) => setPhone(val)}
          placeholder="59112345678"
          required
        />
        {errors.phone && (
          <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
        )}
      </Field>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Siguiente"}
        </Button>
      </div>
    </form>
  );
}
