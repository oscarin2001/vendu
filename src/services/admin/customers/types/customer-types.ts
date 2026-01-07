export interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  loyalCustomers: number;
  averageOrderValue: number;
  customerRetentionRate: number;
  topCustomerSegments: Array<{
    segment: string;
    count: number;
    percentage: number;
  }>;
  customerLifetimeValue: number;
}

export interface CustomerBehavior {
  id: string;
  customerId: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: Date;
  favoriteCategories: string[];
  favoriteProducts: Array<{
    productId: string;
    productName: string;
    purchaseCount: number;
  }>;
  purchaseFrequency: "high" | "medium" | "low";
  loyaltyTier: "platinum" | "gold" | "silver" | "bronze";
  pointsBalance: number;
}

export interface CustomerSegment {
  id: string;
  name: string;
  criteria: {
    minOrders?: number;
    minSpent?: number;
    categories?: string[];
    lastOrderDays?: number;
  };
  customerCount: number;
  totalValue: number;
  averageOrderValue: number;
}

export interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  quantity: number;
  reservedDate: Date;
  expiryDate: Date;
  status: "active" | "expired" | "fulfilled" | "cancelled";
  notes?: string;
}

export interface CustomerFilters {
  segment: "all" | "loyal" | "new" | "inactive";
  search: string;
  loyaltyTier: "all" | "platinum" | "gold" | "silver" | "bronze";
}
