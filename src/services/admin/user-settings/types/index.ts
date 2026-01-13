// User settings types
export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  ci?: string;
  birthDate?: Date;
  joinedAt?: Date;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CompanySettings {
  name: string;
  taxId?: string;
  businessName?: string;
  fiscalAddress?: string;
}

export interface SystemSettings {
  theme: "light" | "dark" | "system";
  notifications?: boolean;
  language: string;
}
