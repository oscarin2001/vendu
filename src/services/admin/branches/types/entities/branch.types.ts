export interface Branch {
  id: number;
  name: string;
  phone: string | null;
  address: string;
  city: string;
  department: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  openingHours: any;
  manager: {
    id: number;
    name: string;
    email: string;
  } | null;
  managers: {
    id: number;
    name: string;
    email: string;
  }[];
  warehouses: {
    id: number;
    name: string;
    address: string;
    isPrimary: boolean;
  }[];
  suppliers: {
    id: number;
    name: string;
    email: string | null;
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
