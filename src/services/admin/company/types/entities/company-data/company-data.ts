export interface CompanyData {
  id: number;
  name: string;
  taxId: string;
  country: string;
  slug: string;
  department?: string;
  commerceType?: string;
  description?: string;
  vision?: string;
  mission?: string;
  openedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  owner?: {
    id: number;
    firstName: string;
    lastName: string;
    phone?: string;
  };
}
