export interface CompanyData {
  name: string;
  country: string;
  phone: string;
  department?: string;
  commerceType?: string;
  description?: string;
  vision?: string;
  mission?: string;
  openedAt?: string;
  tosAccepted?: boolean;
  tosAcceptedAt?: string; // ISO timestamp
  tosRead?: boolean;
  tosReadAt?: string;
}

export interface OwnerData {
  firstName: string;
  lastName: string;
  phone: string;
  ci?: string;
  country: string;
}

export interface BranchData {
  name: string;
  address: string;
  city: string;
  department: string;
  country: string;
  phone: string;
  isWarehouse: boolean;
}

export interface WarehouseData {
  name: string;
  address: string;
  city: string;
  department: string;
  phone: string;
}

export interface FiscalData {
  taxId?: string;
  businessName?: string;
  fiscalAddress?: string;
}

export interface OnboardingData {
  company: CompanyData;
  owner: OwnerData;
  branch: BranchData;
  warehouse?: WarehouseData;
  fiscal?: FiscalData;
}
