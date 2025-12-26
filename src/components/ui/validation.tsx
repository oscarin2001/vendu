"use client";

import { Check, X, AlertCircle } from "lucide-react";

interface ValidationIndicatorProps {
  isValid: boolean | null;
  message?: string;
  className?: string;
}

export function ValidationIndicator({
  isValid,
  message,
  className = "",
}: ValidationIndicatorProps) {
  if (isValid === null) return null;

  const Icon = isValid ? Check : X;
  const colorClass = isValid ? "text-green-500" : "text-red-500";

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <Icon className={`w-4 h-4 ${colorClass}`} />
      {message && <span className={colorClass}>{message}</span>}
    </div>
  );
}

interface FieldValidationProps {
  value: string;
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => boolean;
  };
  showValidation?: boolean;
  className?: string;
}

export function useFieldValidation({
  value,
  rules,
  showValidation = true,
}: FieldValidationProps) {
  const validate = (val: string = value) => {
    if (!showValidation) return { isValid: true, message: "" };

    if (rules.required && !val.trim()) {
      return { isValid: false, message: "Este campo es requerido" };
    }

    if (rules.minLength && val.length < rules.minLength) {
      return {
        isValid: false,
        message: `Mínimo ${rules.minLength} caracteres`,
      };
    }

    if (rules.maxLength && val.length > rules.maxLength) {
      return {
        isValid: false,
        message: `Máximo ${rules.maxLength} caracteres`,
      };
    }

    if (rules.pattern && !rules.pattern.test(val)) {
      return { isValid: false, message: "Formato inválido" };
    }

    if (rules.custom && !rules.custom(val)) {
      return { isValid: false, message: "Valor inválido" };
    }

    return { isValid: true, message: "Válido" };
  };

  const validation = validate();

  return {
    isValid: validation.isValid,
    message: validation.message,
    validate,
  };
}
