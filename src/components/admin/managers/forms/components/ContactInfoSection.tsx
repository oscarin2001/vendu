"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, Mail } from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-input";
import { getCountryConfigByName } from "@/services/admin/config/types/countries";
import {
  filterPhoneFirstDigit,
  getPhoneStartDigitsHint,
} from "@/services/admin/shared/validations";

interface ContactInfoSectionProps {
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  country?: string;
  companySlug?: string; // Slug de la empresa para el dominio del email
  errors: {
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  mode: "create" | "edit";
  onChange: (field: string, value: string) => void;
  onSetError?: (field: string, error: string | undefined) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

export function ContactInfoSection({
  phone,
  email,
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  country,
  companySlug,
  errors,
  mode,
  onChange,
  onSetError,
  onTogglePassword,
  onToggleConfirmPassword,
}: ContactInfoSectionProps) {
  const phoneConfig = getCountryConfigByName(country);
  const phonePrefix = phoneConfig?.phone.prefix ?? "591";
  const phoneLocalLength = phoneConfig?.phone.local ?? 8;

  const handlePhoneChange = (value: string) => {
    let digits = value.replace(/\D/g, "");
    let localDigits = digits;
    if (phonePrefix && digits.startsWith(phonePrefix)) {
      localDigits = digits.slice(phonePrefix.length);
    }
    if (localDigits.length > 0) {
      const filtered = filterPhoneFirstDigit(localDigits, country || "");
      if (filtered !== localDigits) {
        const hint = getPhoneStartDigitsHint(country || "");
        onSetError?.("phone", hint || "Dígito inicial inválido");
        const newVal = phonePrefix + filtered;
        onChange("phone", newVal);
        return;
      }
    }
    if (errors.phone) onSetError?.("phone", undefined);
    onChange("phone", value);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Contacto</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Teléfono</Label>
          <PhoneInput
            value={phone}
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

        <div className="space-y-1">
          <Label htmlFor="email" className="text-xs">
            Correo *
          </Label>
          {companySlug ? (
            // Email con dominio fijo basado en el slug de la empresa
            <div className="flex items-center">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                <Input
                  id="email"
                  type="text"
                  value={email.split("@")[0] || ""}
                  onChange={(e) => {
                    // Solo permitir caracteres válidos para email (sin @)
                    const username = e.target.value
                      .replace(/[@\s]/g, "")
                      .toLowerCase();
                    onChange("email", `${username}@${companySlug}.com`);
                  }}
                  placeholder="usuario"
                  maxLength={64}
                  className={`h-9 pl-9 pr-2 rounded-r-none border-r-0 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              <div className="h-9 px-3 flex items-center bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground select-none">
                @{companySlug}.com
              </div>
            </div>
          ) : (
            // Fallback: email editable completo (sin empresa cargada)
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="correo@empresa.com"
                maxLength={254}
                className={`h-9 pl-9 ${errors.email ? "border-red-500" : ""}`}
              />
            </div>
          )}
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      {mode === "create" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="password" className="text-xs">
              Contraseña *
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => onChange("password", e.target.value)}
                placeholder="Mínimo 8 caracteres"
                maxLength={72}
                className={`h-9 ${errors.password ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
                onClick={onTogglePassword}
              >
                {showPassword ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword" className="text-xs">
              Confirmar *
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                  onChange={(e) => onChange("confirmPassword", e.target.value)}
                  placeholder="Repite la contraseña"
                  maxLength={72}
                className={`h-9 ${errors.confirmPassword ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
                onClick={onToggleConfirmPassword}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
