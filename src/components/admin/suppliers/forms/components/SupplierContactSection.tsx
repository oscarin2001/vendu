"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  filterPhoneFirstDigit,
  getPhoneStartDigitsHint,
} from "@/services/admin/shared/validations";
import { getCountryConfigByName } from "@/services/admin/config/types/countries";
import { SUPPLIER_LIMITS, SupplierFormData } from "../types";

interface ContactSectionProps {
  formData: SupplierFormData;
  errors: Record<string, string>;
  companyCountry?: string;
  onChange: (field: keyof SupplierFormData, value: any) => void;
  setError: (field: string, error: string) => void;
}

export function SupplierContactSection({
  formData,
  errors,
  companyCountry,
  onChange,
  setError,
}: ContactSectionProps) {
  const countryConfig = getCountryConfigByName(companyCountry);
  const phonePrefix = countryConfig?.phone.prefix ?? "591";
  const phoneLocalLength = countryConfig?.phone.local ?? 8;

  const handlePhoneChange = (value: string) => {
    let digits = value.replace(/\D/g, "");
    let localDigits = digits;
    if (phonePrefix && digits.startsWith(phonePrefix)) {
      localDigits = digits.slice(phonePrefix.length);
    }

    if (localDigits.length > 0) {
      const filtered = filterPhoneFirstDigit(localDigits, companyCountry || "");
      if (filtered !== localDigits) {
        const hint = getPhoneStartDigitsHint(companyCountry || "");
        setError("phone", hint || "Dígito inicial inválido");
        onChange("phone", phonePrefix + filtered);
        return;
      }
    }

    if (errors.phone) {
      setError("phone", "");
    }
    onChange("phone", value);
  };

  const handleEmailChange = (value: string) => {
    onChange("email", value.slice(0, SUPPLIER_LIMITS.email.max));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        Información de Contacto
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <PhoneInput
            value={formData.phone || ""}
            onChange={(val) => handlePhoneChange(val)}
            fixedCountryCode={phonePrefix}
            fixedLocalMax={phoneLocalLength}
            hideCountrySelect
            showValidation
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder="correo@ejemplo.com"
            className={errors.email ? "border-red-500" : ""}
            maxLength={SUPPLIER_LIMITS.email.max}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>
      </div>
    </div>
  );
}
