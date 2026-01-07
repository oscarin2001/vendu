"use client";

import { useEffect, useState } from "react";
import type {
  CustomerMetrics,
  CustomerBehavior,
  CustomerSegment,
  Reservation,
  CustomerFilters,
} from "@/services/admin/customers/types";

export function useCustomersDataLoader(tenantId: string) {
  const [customerBehaviors, setCustomerBehaviors] = useState<
    CustomerBehavior[]
  >([]);
  const [metrics, setMetrics] = useState<CustomerMetrics | null>(null);
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filters, setFilters] = useState<CustomerFilters>({
    segment: "all",
    search: "",
    loyaltyTier: "all",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Simulate API calls
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock customer behaviors
        const mockBehaviors: CustomerBehavior[] = [
          {
            id: "1",
            name: "María González",
            email: "maria.gonzalez@email.com",
            phone: "+56912345678",
            totalOrders: 45,
            totalSpent: 2850.0,
            lastOrderDate: new Date("2024-01-05"),
            segment: "VIP",
            status: "active",
            avatar: null,
            customerId: "cust_001",
            loyaltyTier: "platinum",
            averageOrderValue: 63.33,
            orderFrequency: 2.1,
            lifetimeValue: 2850.0,
            favoriteCategories: ["Electronics", "Books"],
            favoriteProducts: [
              {
                productId: "prod_001",
                productName: "Wireless Headphones",
                purchaseCount: 3,
              },
              {
                productId: "prod_002",
                productName: "Programming Book",
                purchaseCount: 5,
              },
            ],
            purchaseFrequency: "weekly",
            pointsBalance: 2850,
          },
          {
            id: "2",
            name: "Carlos Rodríguez",
            email: "carlos.rodriguez@email.com",
            phone: "+56987654321",
            totalOrders: 12,
            totalSpent: 450.0,
            lastOrderDate: new Date("2024-01-03"),
            segment: "Gold",
            status: "active",
            avatar: null,
            customerId: "cust_002",
            loyaltyTier: "gold",
            averageOrderValue: 37.5,
            orderFrequency: 1.2,
            lifetimeValue: 450.0,
            favoriteCategories: ["Clothing", "Home"],
            favoriteProducts: [
              {
                productId: "prod_003",
                productName: "T-Shirt",
                purchaseCount: 2,
              },
            ],
            purchaseFrequency: "monthly",
            pointsBalance: 450,
          },
        ];

        // Mock metrics
        const mockMetrics: CustomerMetrics = {
          totalCustomers: 1250,
          activeCustomers: 890,
          newCustomersThisMonth: 45,
          vipCustomers: 85,
          loyalCustomers: 320,
          totalRevenue: 65250.0,
          averageOrderValue: 52.3,
          customerLifetimeValue: 1250.0,
          customerRetentionRate: 78.5,
          topCustomerSegments: [
            { segment: "High Value", count: 120 },
            { segment: "Frequent", count: 200 },
            { segment: "New", count: 45 },
            { segment: "Occasional", count: 885 },
          ],
        };

        // Mock segments
        const mockSegments: CustomerSegment[] = [
          {
            id: "seg_001",
            name: "High Value Customers",
            criteria: { minSpent: 1000, minOrders: 20 },
            customerCount: 120,
            totalValue: 150000,
            averageOrderValue: 85.5,
            percentage: 37.5,
          },
          {
            id: "seg_002",
            name: "Frequent Shoppers",
            criteria: { minOrders: 10, lastOrderDays: 30 },
            customerCount: 200,
            totalValue: 85000,
            averageOrderValue: 42.5,
            percentage: 62.5,
          },
        ];

        // Mock reservations
        const mockReservations: Reservation[] = [
          {
            id: "res_001",
            customerName: "John Doe",
            productName: "Gaming Laptop",
            quantity: 1,
            reservedDate: new Date("2024-01-05"),
            expiryDate: new Date("2024-01-15"),
            status: "active",
          },
        ];

        setCustomerBehaviors(mockBehaviors);
        setMetrics(mockMetrics);
        setSegments(mockSegments);
        setReservations(mockReservations);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load customer data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [tenantId]);

  const updateFilters = (newFilters: Partial<CustomerFilters>) => {
    setFilters((prev: CustomerFilters) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      segment: "all",
      search: "",
      loyaltyTier: "all",
    });
  };

  const refetch = () => {
    setIsLoading(true);
    // Re-trigger the effect
    setCustomerBehaviors([]);
    setMetrics(null);
    setSegments([]);
    setReservations([]);
  };

  return {
    customerBehaviors,
    metrics,
    segments,
    reservations,
    filters,
    isLoading,
    error,
    updateFilters,
    clearFilters,
    refetch,
  };
}
