export interface Supplier {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  department: string | null;
  country: string | null;
  ci?: string | null;
  notes: string | null;
  birthDate: Date | null; // Fecha de nacimiento del proveedor
  partnerSince: Date | null; // Desde cuándo trabaja con la empresa
  contractEndAt?: Date | null;
  isIndefinite?: boolean;
  isActive: boolean;
  managers: {
    id: number;
    name: string;
    email: string;
  }[];
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: {
    id: number;
    name: string;
  };
  updatedBy?: {
    id: number;
    name: string;
  };
}
