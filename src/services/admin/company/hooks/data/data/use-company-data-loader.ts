"use client";

import { useEffect } from "react";
import {
  getCompanyByTenant,
  getCompanySubscription,
} from "@/services/admin/company/services";
import { toast } from "sonner";
import type { CompanyData } from "@/services/admin/company/types/entities";
import type { SubscriptionData } from "@/services/admin/company/types/entities";

export function useCompanyDataLoader(
  tenantId: string,
  setCompany: (company: CompanyData | null) => void,
  setSubscription: (subscription: SubscriptionData | null) => void,
  setMetrics: (metrics: any) => void,
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
) {
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

      // Handle company not found gracefully
      if (!companyData) {
        setCompany(null);
        setSubscription(null);
        setMetrics({
          totalBranches: 0,
          activeBranches: 0,
          totalEmployees: 0,
          activeEmployees: 0,
        });
        const msg = "Company not found";
        setError(msg);
        toast.error(msg);
        return;
      }

      // Transform company data
      const transformedCompany: CompanyData = {
        id: companyData.id,
        name: companyData.name,
        taxId: companyData.taxId || "",
        taxIdPath: companyData.taxIdPath || undefined,
        country: companyData.country || "",
        slug: companyData.slug,
        department: companyData.department || undefined,
        commerceType: companyData.commerceType || undefined,
        description: companyData.description || undefined,
        vision: companyData.vision || undefined,
        mission: companyData.mission || undefined,
        businessName: companyData.businessName || undefined,
        fiscalAddress: companyData.fiscalAddress || undefined,
        openedAt: companyData.openedAt || undefined,
        createdAt: companyData.createdAt,
        owner: companyData.owner
          ? {
              id: companyData.owner.id,
              firstName: companyData.owner.firstName,
              lastName: companyData.owner.lastName,
              phone: companyData.owner.phone || undefined,
              ci: companyData.owner.ci || undefined,
              birthDate: companyData.owner.birthDate || undefined,
              birthYear: companyData.owner.birthYear || undefined,
              joinedAt: companyData.owner.joinedAt || undefined,
            }
          : undefined,
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
      } else {
        setSubscription(null);
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

  const getPlanAmount = (planType: string) => {
    const amounts = {
      BASIC: 29,
      PRO: 99,
      ENTERPRISE: 299,
    };
    return amounts[planType as keyof typeof amounts] || 0;
  };

  return {
    loadCompanyData,
  };
}
