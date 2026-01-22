import type { FieldChange } from "@/services/admin/shared/hooks/change-tracking";

export interface SupplierFormData {
  firstName: string;
  lastName: string;
  ci?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  department?: string;
  country?: string;
  notes?: string;
  birthDate?: Date | null;
  partnerSince?: Date | null;
  contractEndAt?: Date | null;
  isIndefinite?: boolean;
}

export interface SupplierAuditInfo {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: { id: number; name: string };
  updatedBy?: { id: number; name: string };
}

export interface SupplierFormProps {
  initialData?: Partial<SupplierFormData>;
  onSubmit: (data: SupplierFormData) => void;
  onEditRequest?: (data: SupplierFormData, changes: FieldChange[]) => void;
  isLoading?: boolean;
  mode: "create" | "edit";
  supplierInfo?: SupplierAuditInfo;
  companyCountry?: string;
}

export const SUPPLIER_LIMITS = {
  firstName: { min: 2, max: 30 },
  lastName: { min: 2, max: 30 },
  ci: { max: 20 },
  email: { max: 80 },
  address: { min: 5, max: 300 },
  city: { min: 2, max: 40 },
  notes: { max: 500 },
} as const;
