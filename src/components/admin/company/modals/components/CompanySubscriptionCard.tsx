"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar } from "lucide-react";
import { SubscriptionData } from "@/services/admin/company";

interface CompanySubscriptionCardProps {
  subscription: SubscriptionData;
}

export function CompanySubscriptionCard({
  subscription,
}: CompanySubscriptionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-50 text-green-700 border-green-200";
      case "PAUSED":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Suscripción
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">Plan {subscription.plan}</p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(subscription.amount)}/mes
            </p>
          </div>
          <Badge
            variant="outline"
            className={getStatusColor(subscription.status)}
          >
            {subscription.status}
          </Badge>
        </div>

        {subscription.nextPaymentDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Próximo pago:{" "}
            {new Date(subscription.nextPaymentDate).toLocaleDateString("es-ES")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
