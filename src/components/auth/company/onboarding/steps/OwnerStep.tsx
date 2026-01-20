"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  getCountryConfigByName,
  filterPhoneFirstDigit,
  getPhoneStartDigitsHint,
  validatePhoneByCountry,
} from "@/services/admin/config";
import { saveOnboardingData } from "@/services/auth/company-registration/onboarding/session";
import {
  DatePickerField,
  GenderSelectField,
  validateOwnerForm,
  sanitizeNameInput,
  sanitizeCiInput,
  OWNER_CONSTANTS,
  type OwnerStepProps,
  type OwnerFormData,
} from "./owner";

const { FIRSTNAME_MAX, LASTNAME_MAX, CI_MAX } = OWNER_CONSTANTS;

export function OwnerStep({
  initialData = {},
  companyCountry,
  onDataChange,
  onNext = () => {},
  onBack = () => {},
}: OwnerStepProps) {
  const [formData, setFormData] = useState<OwnerFormData>({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    phone: initialData.phone || "",
    ci: initialData.ci || "",
    gender: initialData.gender || "",
    birthDate: initialData.birthDate || "",
    joinedAt: initialData.joinedAt || "",
  });
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [ciTouched, setCiTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const countryConfig = getCountryConfigByName(companyCountry);
  const phoneHint = companyCountry
    ? getPhoneStartDigitsHint(companyCountry)
    : null;

  // Manejar cambio de teléfono con validación en tiempo real
  const handlePhoneChange = (val: string, valid: boolean) => {
    const config = getCountryConfigByName(companyCountry);
    const prefix = config?.phone.prefix ?? "";

    // Extraer solo dígitos locales
    let digits = val.replace(/\D/g, "");
    let localDigits = digits;
    if (prefix && digits.startsWith(prefix)) {
      localDigits = digits.slice(prefix.length);
    }

    // Filtrar primer dígito si no es válido para el país
    if (companyCountry && localDigits.length > 0) {
      const filtered = filterPhoneFirstDigit(localDigits, companyCountry);
      if (filtered !== localDigits) {
        // El primer dígito era inválido, reconstruir el valor
        const newVal = prefix ? prefix + filtered : filtered;
        updateField("phone", newVal);
        setPhoneValid(false);
        const firstHint = getPhoneStartDigitsHint(companyCountry);
        setPhoneError(
          firstHint ?? validatePhoneByCountry(newVal, companyCountry),
        );
        return;
      }
    }

    updateField("phone", val);
    const error =
      companyCountry && localDigits.length > 0
        ? validatePhoneByCountry(val, companyCountry)
        : null;
    setPhoneValid(!error && valid);

    // Validar y mostrar error
    if (companyCountry && localDigits.length > 0) {
      setPhoneError(error);
    } else {
      setPhoneError(null);
    }
  };

  useEffect(() => {
    onDataChange?.(formData);
    saveOnboardingData({
      owner: { ...formData, country: companyCountry || "" } as any,
    });
  }, [formData, onDataChange, companyCountry]);

  const updateField = <K extends keyof OwnerFormData>(
    field: K,
    value: OwnerFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateOwnerForm(
      formData,
      companyCountry || "",
      phoneValid,
    );
    setErrors(newErrors);
    if (phoneValid === false || phoneError) return;
    if (Object.keys(newErrors).length === 0) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre y Apellido */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Nombre</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) =>
              updateField("firstName", sanitizeNameInput(e.target.value))
            }
            placeholder="Juan"
            maxLength={FIRSTNAME_MAX}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData.firstName.length}/{FIRSTNAME_MAX} caracteres
          </p>
          {errors.firstName && (
            <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) =>
              updateField("lastName", sanitizeNameInput(e.target.value))
            }
            maxLength={LASTNAME_MAX}
            placeholder="Pérez"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData.lastName.length}/{LASTNAME_MAX} caracteres
          </p>
          {errors.lastName && (
            <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Teléfono */}
      <div>
        <Label htmlFor="phone">Celular del responsable</Label>
        <PhoneInput
          value={formData.phone}
          onChange={handlePhoneChange}
          placeholder="XXXXXXXX"
          required
          fixedCountryCode={countryConfig?.phone.prefix}
          fixedLocalMax={countryConfig?.phone.local}
          hideCountrySelect
          showValidation={false}
        />
        {(phoneError || errors.phone) && (
          <p className="text-sm text-red-500 mt-1">
            {phoneError || errors.phone}
          </p>
        )}
      </div>

      {/* CI y Género */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ci">CI / DNI</Label>
          <Input
            id="ci"
            value={formData.ci}
            onChange={(e) => updateField("ci", sanitizeCiInput(e.target.value))}
            onBlur={() => setCiTouched(true)}
            placeholder={"Ej: 1234"}
            maxLength={CI_MAX}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData.ci.length}/{CI_MAX} dígitos
          </p>
          {((ciTouched && !formData.ci) || errors.ci) && (
            <p className="text-sm text-red-500 mt-1">
              {errors.ci ?? "CI/DNI requerido"}
            </p>
          )}
        </div>
        <GenderSelectField
          value={formData.gender}
          onChange={(g) => updateField("gender", g)}
          error={errors.gender}
        />
      </div>

      {/* Fechas opcionales */}
      <DatePickerField
        label="Fecha de nacimiento"
        value={formData.birthDate}
        onChange={(d) => updateField("birthDate", d)}
        optional
      />
      <DatePickerField
        label="Fecha que se unió al equipo"
        value={formData.joinedAt}
        onChange={(d) => updateField("joinedAt", d)}
        optional
      />

      {/* Botones */}
      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button type="submit">Siguiente</Button>
      </div>
    </form>
  );
}
