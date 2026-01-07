"use client";

import { useCRMDataLoader } from "../data/use-crm-data-loader";

export function useCRM(tenantId: string) {
  const { campaigns, loyaltyProgram, segments, metrics, isLoading, refetch } =
    useCRMDataLoader(tenantId);

  return {
    campaigns,
    loyaltyProgram,
    segments,
    metrics,
    isLoading,
    refetch,
  };
}
