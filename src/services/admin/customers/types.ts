export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date;
  segment: "VIP" | "Gold" | "Silver" | "Bronze";
  status: "active" | "inactive";
  avatar: string | null;
}

export interface CustomerBehavior {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date;
  segment: "VIP" | "Gold" | "Silver" | "Bronze";
  status: "active" | "inactive";
  avatar: string | null;
  loyaltyTier: "platinum" | "gold" | "silver" | "bronze";
  averageOrderValue: number;
  orderFrequency: number;
  lifetimeValue: number;
  customerId: string;
  favoriteCategories: string[];
  favoriteProducts: {
    productId: string;
    productName: string;
    purchaseCount: number;
  }[];
  purchaseFrequency: "daily" | "weekly" | "monthly" | "quarterly";
  pointsBalance: number;
}

export interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  vipCustomers: number;
  loyalCustomers: number;
  totalRevenue: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
  customerRetentionRate: number;
  topCustomerSegments: { segment: string; count: number }[];
}

export interface CustomerSegment {
  id: string;
  name: string;
  customerCount: number;
  percentage: number;
  averageOrderValue: number;
  totalValue: number;
  criteria: {
    minOrders?: number;
    minSpent?: number;
    lastOrderDays?: number;
  };
}

export interface Reservation {
  id: string;
  customerName: string;
  productName: string;
  quantity: number;
  reservedDate: Date;
  expiryDate: Date;
  status: "active" | "expired" | "fulfilled" | "cancelled";
}

export interface CustomerFilters {
  segment: "all" | "loyal" | "new" | "inactive";
  search: string;
  loyaltyTier: "all" | "platinum" | "gold" | "silver" | "bronze";
}
