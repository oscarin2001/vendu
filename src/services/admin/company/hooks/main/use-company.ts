"use client";

import { useCompanyState } from "./data/use-company-state";
import { useCompanyDataLoader } from "../data";
import { useCompanyActions } from "../actions";

export function useCompany(tenantId: string) {
  const {
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
  } = useCompanyState();

  const { loadCompanyData } = useCompanyDataLoader(
    tenantId,
    setCompany,
    setSubscription,
    setMetrics,
    setIsLoading,
    setError
  );

  const { updateCompanyData } = useCompanyActions(tenantId, loadCompanyData);

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
