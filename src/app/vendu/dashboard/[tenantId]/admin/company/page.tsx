"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CompanyForm } from "@/components/admin/company/forms/CompanyForm";
import { SubscriptionCard } from "@/components/admin/company/cards/SubscriptionCard";
import {
  getCompanyByTenant,
  updateCompany,
  getCompanySubscription,
} from "@/services/admin/company/services/company-service";

export default function CompanyPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const [companyData, setCompanyData] = useState<any>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCompanyData();
  }, [tenantId]);

  const loadCompanyData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [company, subscription] = await Promise.all([
        getCompanyByTenant(tenantId),
        getCompanySubscription(tenantId),
      ]);

      setCompanyData({
        name: company.name,
        taxId: company.taxId,
        country: company.country,
      });

      setSubscriptionData(
        subscription
          ? {
              plan: subscription.planType,
              status: subscription.status,
              nextPaymentDate: subscription.nextBillingDate
                .toISOString()
                .split("T")[0],
              amount: getPlanAmount(subscription.planType),
            }
          : null
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load company data"
      );
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

  const handleUpdateCompany = async (data: any) => {
    try {
      await updateCompany(tenantId, data);
      await loadCompanyData(); // Recargar datos
      alert("Company updated successfully");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update company");
    }
  };

  const handleUpgradePlan = () => {
    alert("Plan upgrade functionality coming soon");
  };

  const handleCancelSubscription = () => {
    if (confirm("Are you sure you want to cancel your subscription?")) {
      alert("Subscription cancellation functionality coming soon");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Company Management</h1>
        <p className="text-muted-foreground">
          Manage your company basic information and subscription.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CompanyForm initialData={companyData} onSubmit={handleUpdateCompany} />

        {subscriptionData && (
          <SubscriptionCard
            plan={subscriptionData.plan}
            status={subscriptionData.status}
            nextPaymentDate={subscriptionData.nextPaymentDate}
            amount={subscriptionData.amount}
            onUpgrade={handleUpgradePlan}
            onCancel={handleCancelSubscription}
          />
        )}
      </div>
    </div>
  );
}
