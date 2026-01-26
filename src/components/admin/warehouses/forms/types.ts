import type { FieldChange } from "@/services/admin/shared/hooks/change-tracking";

export interface WarehouseFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  country: string;
  openedAt: Date | null;
}

export interface WarehouseAuditInfo {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: { id: number; name: string };
  updatedBy?: { id: number; name: string };
}

export interface WarehouseFormProps {
  initialData?: Partial<WarehouseFormData>;
  onSubmit: (data: WarehouseFormData) => void;
  onEditRequest?: (data: WarehouseFormData, changes: FieldChange[]) => void;
  isLoading?: boolean;
  mode: "create" | "edit";
  warehouseInfo?: WarehouseAuditInfo;
  companyCountry?: string;
  onCancel?: () => void;
}
