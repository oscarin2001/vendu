import type { FieldChange } from "@/services/admin/shared/hooks/change-tracking";

export interface BranchFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  country: string;
  openedAt: Date | null;
}

export interface BranchAuditInfoType {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: { id: number; name: string };
  updatedBy?: { id: number; name: string };
}

export interface BranchFormProps {
  initialData?: Partial<BranchFormData>;
  onSubmit: (data: BranchFormData) => void;
  onEditRequest?: (data: BranchFormData, changes: FieldChange[]) => void;
  isLoading?: boolean;
  mode: "create" | "edit";
  branchInfo?: BranchAuditInfoType;
  companyCountry?: string;
}
