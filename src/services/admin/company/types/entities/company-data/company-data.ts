export interface CompanyData {
  id: number;
  name: string;
  taxId?: string;
  taxIdPath?: string;
  country: string;
  slug: string;
  department?: string;
  commerceType?: string;
  description?: string;
  vision?: string;
  mission?: string;
  businessName?: string;
  fiscalAddress?: string;
  openedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  owner?: {
    id: number;
    firstName: string;
    lastName: string;
    phone?: string;
    ci?: string;
    birthDate?: Date;
    birthYear?: number;
    joinedAt?: Date;
    contractEndAt?: Date;
  };
}
