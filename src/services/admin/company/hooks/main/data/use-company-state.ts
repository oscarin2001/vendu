"use client";

import { useState } from "react";
import type {
  CompanyData,
  CompanyMetrics,
  SubscriptionData,
} from "@/services/admin/company/types/entities";

export function useCompanyState() {
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

  return {
    company,
    setCompany,
    subscription,
    setSubscription,
    metrics,
    setMetrics,
    isLoading,
    setIsLoading,
    error,
    setError,
  };
}
