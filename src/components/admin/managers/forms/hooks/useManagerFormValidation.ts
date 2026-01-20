import { validateSalaryByCountry } from "@/services/admin/shared/validations";
import {
  filterNameInput,
  validateCIByCountry,
} from "@/services/admin/shared/validations";

export interface SubmitData {
  firstName: string;
  lastName: string;
  ci: string;
  phone: string;
  email: string;
  password: string;
  salary?: number;
  branchIds?: number[];
  contributionType: "none" | "contributes" | "paid";
  hireDate?: Date;
}

export interface ManagerFormData extends SubmitData {
  confirmPassword: string;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  ci?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  salary?: string;
  branchIds?: string;
  contributionType?: string;
  hireDate?: string;
  general?: string;
}

export function useManagerFormValidation(country?: string) {
  const validateField = (
    field: string,
    value: any,
    formData?: ManagerFormData,
    mode: "create" | "edit" = "create",
  ): string | undefined => {
    switch (field) {
      case "firstName":
        if (!value?.trim()) return "El nombre es requerido";
        if (value.length < 2)
          return "El nombre debe tener al menos 2 caracteres";
        // Check if contains only letters
        if (filterNameInput(value) !== value)
          return "El nombre solo puede contener letras";
        break;
      case "lastName":
        if (!value?.trim()) return "El apellido es requerido";
        if (value.length < 2)
          return "El apellido debe tener al menos 2 caracteres";
        if (filterNameInput(value) !== value)
          return "El apellido solo puede contener letras";
        break;
      case "ci":
        if (!value?.trim()) return "La cédula es requerida";
        if (!/^\d{6,10}$/.test(value))
          return "La cédula debe contener solo números (6-10 dígitos)";
        // Validate CI by country
        const ciError = validateCIByCountry(value, country || "");
        if (ciError) return ciError;
        break;
      case "email":
        if (!value?.trim()) return "El correo electrónico es requerido";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Formato de correo inválido";
        break;
      case "password":
        if (mode === "create") {
          if (!value?.trim()) return "La contraseña es requerida";
          if (value.length < 8)
            return "La contraseña debe tener al menos 8 caracteres";
          if (!/[A-Z]/.test(value))
            return "La contraseña debe contener al menos una mayúscula";
        } else if (mode === "edit" && value?.trim()) {
          // En edición, si se proporciona contraseña, validar
          if (value.length < 8)
            return "La contraseña debe tener al menos 8 caracteres";
          if (!/[A-Z]/.test(value))
            return "La contraseña debe contener al menos una mayúscula";
        }
        break;
      case "confirmPassword":
        if (mode === "create") {
          if (!value?.trim())
            return "La confirmación de contraseña es requerida";
          if (formData && value !== formData.password)
            return "Las contraseñas no coinciden";
        } else if (
          mode === "edit" &&
          formData?.password?.trim() &&
          !value?.trim()
        ) {
          return "La confirmación de contraseña es requerida cuando se cambia la contraseña";
        } else if (
          mode === "edit" &&
          value?.trim() &&
          formData &&
          value !== formData.password
        ) {
          return "Las contraseñas no coinciden";
        }
        break;
      case "salary":
        if (value && value < 0) return "El salario no puede ser negativo";
        // Validate salary by country
        if (value) {
          const salaryError = validateSalaryByCountry(value, country || "");
          if (salaryError) return salaryError;
        }
        break;
      case "branchIds":
        // No longer required - branch assignment is done via configuration
        break;
      case "contributionType":
        if (!value) return "El tipo de contribución es requerido";
        break;
      case "hireDate":
        if (!value) return "La fecha de contratación es requerida";
        break;
    }
  };

  return { validateField };
}
