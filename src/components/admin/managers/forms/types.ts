import type { FieldChange } from "@/services/admin/shared/hooks/change-tracking";

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
  birthDate?: Date;
  joinedAt?: Date;
  contractEndAt?: Date;
  isIndefinite?: boolean;
  homeAddress?: string;
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
  birthDate?: string;
  joinedAt?: string;
  contractEndAt?: string;
  homeAddress?: string;
  general?: string;
}

export interface ManagerInitialData {
  firstName: string;
  lastName: string;
  ci: string;
  phone: string;
  email: string;
  salary?: number;
  branchIds?: number[];
  contributionType?: "none" | "contributes" | "paid";
  hireDate?: Date;
  birthDate?: Date;
  joinedAt?: Date;
  contractEndAt?: Date;
  isIndefinite?: boolean;
  homeAddress?: string;
}

export interface ManagerFormProps {
  tenantId: string;
  companyCountry?: string;
  initialData?: ManagerInitialData;
  branches: { id: number; name: string }[];
  onSubmit: (data: SubmitData) => void;
  /** Called in edit mode when user wants to submit; returns changes info */
  onEditRequest?: (data: SubmitData, changes: FieldChange[]) => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
  onCancel?: () => void;
  managerInfo?: {
    id: number;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: { id: number; name: string };
    updatedBy?: { id: number; name: string };
  };
}
