"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Crown,
  Star,
  ShoppingCart,
  DollarSign,
  Calendar,
  Tag,
} from "lucide-react";
import { CustomerBehavior } from "@/services/admin/customers/types";

interface CustomerDetailsModalProps {
  customer: CustomerBehavior | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerDetailsModal({
  customer,
  isOpen,
  onClose,
}: CustomerDetailsModalProps) {
  if (!customer) return null;

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

  const getLoyaltyTierName = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "Platino";
      case "gold":
        return "Oro";
      case "silver":
        return "Plata";
      case "bronze":
        return "Bronce";
      default:
        return tier;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Cliente</DialogTitle>
          <DialogDescription>
            Información completa del comportamiento de compra del cliente{" "}
            {customer.customerId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Información General
                <Badge variant={getLoyaltyBadgeVariant(customer.loyaltyTier)}>
                  <Crown className="w-3 h-3 mr-1" />
                  {getLoyaltyTierName(customer.loyaltyTier)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{customer.totalOrders}</p>
                  <p className="text-xs text-muted-foreground">
                    Órdenes totales
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    ${customer.totalSpent.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">Gasto total</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {customer.pointsBalance}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Puntos acumulados
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {customer.lastOrderDate.toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Última orden</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categorías favoritas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Categorías Favoritas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {customer.favoriteCategories.map(
                  (category: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {category}
                    </Badge>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Productos favoritos */}
          <Card>
            <CardHeader>
              <CardTitle>Productos Más Comprados</CardTitle>
              <CardDescription>
                Productos que este cliente compra con mayor frecuencia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customer.favoriteProducts.map(
                  (
                    product: {
                      productId: string;
                      productName: string;
                      purchaseCount: number;
                    },
                    index: number
                  ) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          Comprado {product.purchaseCount} veces
                        </p>
                      </div>
                      <Badge variant="outline">{product.purchaseCount}x</Badge>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas adicionales */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Compra</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Valor promedio por orden
                </p>
                <p className="text-lg font-semibold">
                  ${customer.averageOrderValue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Frecuencia de compra
                </p>
                <p className="text-lg font-semibold capitalize">
                  {customer.purchaseFrequency === "daily"
                    ? "Diaria"
                    : customer.purchaseFrequency === "weekly"
                    ? "Semanal"
                    : customer.purchaseFrequency === "monthly"
                    ? "Mensual"
                    : "Trimestral"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
