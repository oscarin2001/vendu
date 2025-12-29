"use client";

import { CompanyForm } from "../forms/CompanyForm";
import { SubscriptionCard } from "../cards/SubscriptionCard";

export function CompanyManagement() {
  // TODO: Get real subscription data from API
  const mockSubscription = {
    plan: "PRO" as const,
    status: "ACTIVE" as const,
    nextPaymentDate: "2024-12-31",
    amount: 29.99,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Empresa</h1>
        <p className="text-muted-foreground">
          Gestiona la información de tu empresa
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CompanyForm />
        <SubscriptionCard
          plan={mockSubscription.plan}
          status={mockSubscription.status}
          nextPaymentDate={mockSubscription.nextPaymentDate}
          amount={mockSubscription.amount}
        />
      </div>
    </div>
  );
}
