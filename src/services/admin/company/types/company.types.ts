export interface CompanyData {
  id: number;
  name: string;
  taxId: string;
  country: string;
  slug: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface SubscriptionData {
  plan: string;
  status: string;
  nextPaymentDate: string;
  amount: number;
}

export interface CompanyMetrics {
  totalBranches: number;
  activeBranches: number;
  totalEmployees: number;
  activeEmployees: number;
}
