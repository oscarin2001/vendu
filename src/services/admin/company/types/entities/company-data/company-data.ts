export interface CompanyData {
  id: number;
  name: string;
  taxId: string;
  country: string;
  slug: string;
  createdAt: Date;
  updatedAt?: Date;
}
