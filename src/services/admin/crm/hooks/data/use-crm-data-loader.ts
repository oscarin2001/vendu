"use client";

import { useState, useEffect } from "react";
import type {
  Campaign,
  LoyaltyProgram,
  CustomerSegment,
  CRMMetrics,
} from "../../types";

export function useCRMDataLoader(tenantId: string) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram | null>(
    null
  );
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [metrics, setMetrics] = useState<CRMMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCRMData();
  }, [tenantId]);

  const loadCRMData = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with real API calls
      setCampaigns([
        {
          id: "1",
          name: "Liquidación Invierno",
          description: "Descuentos en ropa de invierno",
          type: "email",
          status: "active",
          targetSegment: "Inactivos 30 días",
          startDate: new Date("2026-01-01"),
          endDate: new Date("2026-01-31"),
          metrics: { sent: 1250, opened: 312, clicked: 94, converted: 23 },
          createdAt: new Date("2025-12-20"),
          updatedAt: new Date("2025-12-20"),
        },
        {
          id: "2",
          name: "Bienvenida Nuevos Clientes",
          description: "Campaña de onboarding",
          type: "email",
          status: "completed",
          targetSegment: "Nuevos clientes",
          startDate: new Date("2025-12-01"),
          endDate: new Date("2025-12-15"),
          metrics: { sent: 89, opened: 67, clicked: 34, converted: 12 },
          createdAt: new Date("2025-11-25"),
          updatedAt: new Date("2025-12-15"),
        },
      ]);

      setLoyaltyProgram({
        id: "1",
        name: "Programa de Fidelidad",
        description: "Acumula puntos por cada compra",
        pointsPerDollar: 1,
        isActive: true,
        levels: [
          {
            id: "1",
            name: "Bronce",
            minPoints: 0,
            benefits: ["5% descuento"],
            color: "#CD7F32",
          },
          {
            id: "2",
            name: "Plata",
            minPoints: 500,
            benefits: ["10% descuento", "Envío gratis"],
            color: "#C0C0C0",
          },
          {
            id: "3",
            name: "Oro",
            minPoints: 1500,
            benefits: ["15% descuento", "Envío gratis", "Acceso anticipado"],
            color: "#FFD700",
          },
          {
            id: "4",
            name: "Platino",
            minPoints: 3000,
            benefits: [
              "20% descuento",
              "Envío gratis",
              "Acceso anticipado",
              "Producto gratis",
            ],
            color: "#E5E4E2",
          },
        ],
        rules: [
          {
            id: "1",
            trigger: "purchase",
            points: 1,
            description: "1 punto por cada $1 gastado",
          },
          {
            id: "2",
            trigger: "referral",
            points: 100,
            description: "100 puntos por referir amigo",
          },
        ],
      });

      setSegments([
        {
          id: "1",
          name: "VIP",
          description: "Clientes con >$5000 gastados",
          criteria: [{ field: "totalSpent", operator: "gt", value: 5000 }],
          customerCount: 45,
          createdAt: new Date("2025-01-01"),
        },
        {
          id: "2",
          name: "Nuevos",
          description: "Clientes de último mes",
          criteria: [{ field: "lastPurchase", operator: "gt", value: 30 }],
          customerCount: 123,
          createdAt: new Date("2025-12-01"),
        },
        {
          id: "3",
          name: "Inactivos",
          description: "Sin compras en 90 días",
          criteria: [{ field: "lastPurchase", operator: "gt", value: 90 }],
          customerCount: 234,
          createdAt: new Date("2025-10-01"),
        },
      ]);

      setMetrics({
        totalCustomers: 1250,
        activeCampaigns: 3,
        totalPointsIssued: 45670,
        averageOrderValue: 85,
        customerRetentionRate: 68,
        campaignConversionRate: 12.5,
      });
    } catch (error) {
      console.error("Error loading CRM data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    campaigns,
    loyaltyProgram,
    segments,
    metrics,
    isLoading,
    refetch: loadCRMData,
  };
}
