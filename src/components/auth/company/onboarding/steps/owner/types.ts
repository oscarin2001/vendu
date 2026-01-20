export interface OwnerFormData {
  firstName: string;
  lastName: string;
  phone: string;
  ci: string;
  gender: string;
  birthDate: string;
  joinedAt: string;
}

export interface OwnerStepProps {
  initialData?: Partial<OwnerFormData>;
  companyCountry?: string;
  onDataChange?: (data: OwnerFormData) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export const OWNER_CONSTANTS = {
  FIRSTNAME_MAX: 60,
  LASTNAME_MAX: 80,
  CI_MAX: 12,
  GENDERS: ["Masculino", "Femenino", "Otro"] as const,
} as const;
