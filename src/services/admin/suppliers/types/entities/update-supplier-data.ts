export interface UpdateSupplierData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  department?: string;
  country?: string;
  ci?: string;
  notes?: string;
  birthDate?: Date | null; // Fecha de nacimiento del proveedor
  partnerSince?: Date | null; // Desde cuándo trabaja con la empresa
  contractEndAt?: Date | null;
  isIndefinite?: boolean;
  isActive?: boolean;
}
