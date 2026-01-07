"use client";

import { useState, useEffect } from "react";
import {
  Customer,
  CustomerBehavior,
  Reservation,
} from "@/services/admin/customers/types";

// Mock data for customers
const mockCustomers: CustomerBehavior[] = [
  {
    id: "1",
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+56912345678",
    totalOrders: 45,
    totalSpent: 1250000,
    lastOrderDate: new Date("2024-12-20"),
    segment: "VIP",
    status: "active",
    avatar: null,
    loyaltyTier: "platinum",
    averageOrderValue: 27777.78,
    orderFrequency: 3.75,
    lifetimeValue: 1250000,
    customerId: "1",
    favoriteCategories: ["Electronics", "Accessories"],
    favoriteProducts: [
      { productId: "1", productName: "iPhone 15 Pro Max", purchaseCount: 3 },
      { productId: "2", productName: "AirPods Pro", purchaseCount: 5 },
    ],
    purchaseFrequency: "monthly",
    pointsBalance: 12500,
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@email.com",
    phone: "+56987654321",
    totalOrders: 32,
    totalSpent: 890000,
    lastOrderDate: new Date("2024-12-18"),
    segment: "Gold",
    status: "active",
    avatar: null,
    loyaltyTier: "gold",
    averageOrderValue: 27812.5,
    orderFrequency: 2.67,
    lifetimeValue: 890000,
    customerId: "2",
    favoriteCategories: ["Electronics", "Computers"],
    favoriteProducts: [
      { productId: "3", productName: "MacBook Pro M3", purchaseCount: 2 },
      { productId: "4", productName: "iPad Air", purchaseCount: 3 },
    ],
    purchaseFrequency: "monthly",
    pointsBalance: 8900,
  },
  {
    id: "3",
    name: "Ana López",
    email: "ana.lopez@email.com",
    phone: "+56955556666",
    totalOrders: 28,
    totalSpent: 675000,
    lastOrderDate: new Date("2024-12-15"),
    segment: "Silver",
    status: "active",
    avatar: null,
    loyaltyTier: "silver",
    averageOrderValue: 24107.14,
    orderFrequency: 2.33,
    lifetimeValue: 675000,
    customerId: "3",
    favoriteCategories: ["Accessories", "Audio"],
    favoriteProducts: [
      { productId: "5", productName: "AirPods Pro", purchaseCount: 4 },
      { productId: "6", productName: "Apple Watch Series 9", purchaseCount: 2 },
    ],
    purchaseFrequency: "quarterly",
    pointsBalance: 6750,
  },
  {
    id: "4",
    name: "Pedro Martínez",
    email: "pedro.martinez@email.com",
    phone: "+56944443333",
    totalOrders: 15,
    totalSpent: 320000,
    lastOrderDate: new Date("2024-12-10"),
    segment: "Bronze",
    status: "inactive",
    avatar: null,
    loyaltyTier: "bronze",
    averageOrderValue: 21333.33,
    orderFrequency: 1.25,
    lifetimeValue: 320000,
    customerId: "4",
    favoriteCategories: ["Accessories"],
    favoriteProducts: [
      { productId: "7", productName: "iPad Air", purchaseCount: 2 },
      { productId: "8", productName: "Apple Pencil", purchaseCount: 1 },
    ],
    purchaseFrequency: "quarterly",
    pointsBalance: 3200,
  },
  {
    id: "5",
    name: "Sofía Hernández",
    email: "sofia.hernandez@email.com",
    phone: "+56977778888",
    totalOrders: 67,
    totalSpent: 2100000,
    lastOrderDate: new Date("2024-12-22"),
    segment: "VIP",
    status: "active",
    avatar: null,
    loyaltyTier: "platinum",
    averageOrderValue: 31343.28,
    orderFrequency: 5.58,
    lifetimeValue: 2100000,
    customerId: "5",
    favoriteCategories: ["Electronics", "Wearables"],
    favoriteProducts: [
      { productId: "9", productName: "Apple Watch Series 9", purchaseCount: 3 },
      { productId: "10", productName: "iPhone 15", purchaseCount: 4 },
    ],
    purchaseFrequency: "weekly",
    pointsBalance: 21000,
  },
];

// Mock data for reservations
const mockReservations: Reservation[] = [
  {
    id: "1",
    customerName: "María González",
    productName: "iPhone 15 Pro Max",
    quantity: 1,
    reservedDate: new Date("2024-12-15"),
    expiryDate: new Date("2024-12-25"),
    status: "active",
  },
  {
    id: "2",
    customerName: "Carlos Rodríguez",
    productName: "MacBook Pro M3",
    quantity: 1,
    reservedDate: new Date("2024-12-10"),
    expiryDate: new Date("2024-12-20"),
    status: "expired",
  },
  {
    id: "3",
    customerName: "Ana López",
    productName: "AirPods Pro",
    quantity: 2,
    reservedDate: new Date("2024-12-18"),
    expiryDate: new Date("2024-12-28"),
    status: "active",
  },
  {
    id: "4",
    customerName: "Pedro Martínez",
    productName: "iPad Air",
    quantity: 1,
    reservedDate: new Date("2024-12-05"),
    expiryDate: new Date("2024-12-15"),
    status: "fulfilled",
  },
  {
    id: "5",
    customerName: "Sofía Hernández",
    productName: "Apple Watch Series 9",
    quantity: 1,
    reservedDate: new Date("2024-12-20"),
    expiryDate: new Date("2024-12-30"),
    status: "active",
  },
];

export function useCustomers() {
  const [customers, setCustomers] = useState<CustomerBehavior[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);

  useEffect(() => {
    // Simulate API call for customers
    const loadCustomers = async () => {
      setIsLoadingCustomers(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCustomers(mockCustomers);
      setIsLoadingCustomers(false);
    };

    // Simulate API call for reservations
    const loadReservations = async () => {
      setIsLoadingReservations(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setReservations(mockReservations);
      setIsLoadingReservations(false);
    };

    loadCustomers();
    loadReservations();
  }, []);

  return {
    customers,
    reservations,
    isLoadingCustomers,
    isLoadingReservations,
  };
}
