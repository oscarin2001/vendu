import { CustomerMetrics } from "@/services/admin/customers/types";

export interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface CustomerFiltersProps {
  filters: {
    segment: 'all' | 'loyal' | 'new' | 'inactive';
    search: string;
    loyaltyTier: 'all' | 'platinum' | 'gold' | 'silver' | 'bronze';
  };
  onFiltersChange: (filters: {
    segment: 'all' | 'loyal' | 'new' | 'inactive';
    search: string;
    loyaltyTier: 'all' | 'platinum' | 'gold' | 'silver' | 'bronze';
  }) => void;
  onClearFilters: () => void;
}