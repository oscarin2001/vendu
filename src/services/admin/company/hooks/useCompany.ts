"use client";

import { useState, useEffect } from "react";
import {
  getCompanyByTenant,
  updateCompany,
  getCompanySubscription,
} from "@/services/admin/company/services/company-service";
import { toast } from "sonner";
import type {
  CompanyData,
  SubscriptionData,
  CompanyMetrics,
} from "../types/company.types";

export function useCompany(tenantId: string) {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  const [metrics, setMetrics] = useState<CompanyMetrics>({
    totalBranches: 0,
    activeBranches: 0,
    totalEmployees: 0,
    activeEmployees: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load company data
  useEffect(() => {
    if (tenantId) {
      loadCompanyData();
    } else {
      setIsLoading(false);
    }
  }, [tenantId]);

  const loadCompanyData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [companyData, subscriptionData] = await Promise.all([
        getCompanyByTenant(tenantId),
        getCompanySubscription(tenantId),
      ]);

      // Transform company data
      const transformedCompany: CompanyData = {
        id: companyData.id,
        name: companyData.name,
        taxId: companyData.taxId || "",
        country: companyData.country || "",
        slug: companyData.slug,
        createdAt: companyData.createdAt,
        updatedAt: companyData.createdAt, // TODO: Add updatedAt to service if needed
      };

      setCompany(transformedCompany);

      // Transform subscription data
      if (subscriptionData) {
        const transformedSubscription: SubscriptionData = {
          plan: subscriptionData.planType,
          status: subscriptionData.status,
          nextPaymentDate:
            subscriptionData.nextBillingDate?.toISOString().split("T")[0] || "",
          amount: getPlanAmount(subscriptionData.planType),
        };
        setSubscription(transformedSubscription);
      }

      // Load metrics (placeholder - you might want to create actual metrics service)
      setMetrics({
        totalBranches: 0, // TODO: Implement actual metrics
        activeBranches: 0,
        totalEmployees: 0,
        activeEmployees: 0,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error loading company data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCompanyData = async (data: any) => {
    try {
      await updateCompany(tenantId, data);
      await loadCompanyData(); // Reload data
      toast.success("Empresa actualizada exitosamente");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar la empresa";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getPlanAmount = (planType: string) => {
    const amounts = {
      BASIC: 29,
      PRO: 99,
      ENTERPRISE: 299,
    };
    return amounts[planType as keyof typeof amounts] || 0;
  };

  return {
    company,
    subscription,
    metrics,
    isLoading,
    error,
    updateCompanyData,
    reloadData: loadCompanyData,
  };
}
