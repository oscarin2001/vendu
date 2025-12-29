"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { CreditCard, Calendar, AlertCircle } from "lucide-react";

interface SubscriptionCardProps {
  plan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  nextPaymentDate?: string;
  amount?: number;
  onUpgrade?: () => void;
  onCancel?: () => void;
}

export function SubscriptionCard({
  plan,
  status,
  nextPaymentDate,
  amount,
  onUpgrade,
  onCancel
}: SubscriptionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'PAUSED': return 'bg-yellow-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlanFeatures = (plan: string) => {
    switch (plan) {
      case 'BASIC': return ['Hasta 3 sucursales', 'Inventario básico'];
      case 'PRO': return ['Hasta 10 sucursales', 'Reportes avanzados', 'Soporte prioritario'];
      case 'ENTERPRISE': return ['Sucursales ilimitadas', 'API completa', 'Soporte 24/7'];
      default: return [];
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Plan {plan}
          </CardTitle>
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Características del Plan:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {getPlanFeatures(plan).map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
        </div>

        {nextPaymentDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>Próximo pago: {nextPaymentDate}</span>
            {amount && <span className="font-semibold">${amount}</span>}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={onUpgrade}>
            Cambiar Plan
          </Button>
          {status === 'ACTIVE' && (
            <Button variant="destructive" onClick={onCancel}>
              <AlertCircle className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}