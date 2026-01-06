import type {
  CreateWarehouseData,
  UpdateWarehouseData,
} from "../../validations/types/warehouse-validation-types";

// Overload: full create input -> required fields
export function normalizeWarehouseInput(data: CreateWarehouseData): {
  name: string;
  phone?: string;
  address: string;
  city: string;
  department?: string;
  country?: string;
};

// Overload: partial/update input -> optional fields
export function normalizeWarehouseInput(
  data: Partial<CreateWarehouseData> | UpdateWarehouseData
): {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  department?: string;
  country?: string;
};

export function normalizeWarehouseInput(data: any) {
  return {
    name: data.name?.trim(),
    phone: data.phone?.trim() ?? undefined,
    address: data.address?.trim(),
    city: data.city?.trim(),
    department: data.department?.trim() ?? undefined,
    country: data.country?.trim() ?? undefined,
  };
}
