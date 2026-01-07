"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Crown, Star } from "lucide-react";
import { CustomerBehavior } from "@/services/admin/customers/types";

interface CustomerBehaviorTableProps {
  customers: CustomerBehavior[];
  isLoading: boolean;
  onViewCustomer: (customer: CustomerBehavior) => void;
}

export function CustomerBehaviorTable({
  customers,
  isLoading,
  onViewCustomer,
}: CustomerBehaviorTableProps) {
  const getLoyaltyBadgeVariant = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "default";
      case "gold":
        return "secondary";
      case "silver":
        return "outline";
      case "bronze":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getFrequencyBadgeVariant = (frequency: string) => {
    switch (frequency) {
      case "high":
        return "default";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comportamiento de Clientes</CardTitle>
          <CardDescription>
            Análisis detallado del comportamiento de compra
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comportamiento de Clientes</CardTitle>
        <CardDescription>
          Análisis detallado del comportamiento de compra
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente ID</TableHead>
              <TableHead>Órdenes Totales</TableHead>
              <TableHead>Gasto Total</TableHead>
              <TableHead>Valor Promedio</TableHead>
              <TableHead>Frecuencia</TableHead>
              <TableHead>Nivel Lealtad</TableHead>
              <TableHead>Puntos</TableHead>
              <TableHead>Última Orden</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  {customer.customerId}
                </TableCell>
                <TableCell>{customer.totalOrders}</TableCell>
                <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                <TableCell>${customer.averageOrderValue.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={getFrequencyBadgeVariant(
                      customer.purchaseFrequency
                    )}
                  >
                    {customer.purchaseFrequency === "daily"
                      ? "Diaria"
                      : customer.purchaseFrequency === "weekly"
                      ? "Semanal"
                      : customer.purchaseFrequency === "monthly"
                      ? "Mensual"
                      : "Trimestral"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getLoyaltyBadgeVariant(customer.loyaltyTier)}>
                    <Crown className="w-3 h-3 mr-1" />
                    {customer.loyaltyTier === "platinum"
                      ? "Platino"
                      : customer.loyaltyTier === "gold"
                      ? "Oro"
                      : customer.loyaltyTier === "silver"
                      ? "Plata"
                      : "Bronce"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 mr-1 text-yellow-500" />
                    {customer.pointsBalance}
                  </div>
                </TableCell>
                <TableCell>
                  {customer.lastOrderDate.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewCustomer(customer)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
