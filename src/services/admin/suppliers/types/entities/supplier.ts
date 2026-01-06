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
  notes: string | null;
  isActive: boolean;
  managers: {
    id: number;
    name: string;
    email: string;
  }[];
  createdAt: Date;
  updatedAt?: Date;
}
