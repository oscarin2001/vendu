export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: "email" | "sms" | "push" | "social";
  status: "draft" | "active" | "paused" | "completed";
  targetSegment: string;
  startDate: Date;
  endDate?: Date;
  metrics: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  pointsPerDollar: number;
  levels: LoyaltyLevel[];
  rules: LoyaltyRule[];
  isActive: boolean;
}

export interface LoyaltyLevel {
  id: string;
  name: string;
  minPoints: number;
  benefits: string[];
  color: string;
}

export interface LoyaltyRule {
  id: string;
  trigger: "purchase" | "referral" | "review";
  points: number;
  description: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria[];
  customerCount: number;
  createdAt: Date;
}

export interface SegmentCriteria {
  field:
    | "totalSpent"
    | "purchaseFrequency"
    | "lastPurchase"
    | "productCategory";
  operator: "gt" | "lt" | "eq" | "between";
  value: number | string | [number, number];
}

export interface CRMMetrics {
  totalCustomers: number;
  activeCampaigns: number;
  totalPointsIssued: number;
  averageOrderValue: number;
  customerRetentionRate: number;
  campaignConversionRate: number;
}
