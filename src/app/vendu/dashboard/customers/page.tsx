"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FrequentCustomers } from "@/components/admin/customers/components/FrequentCustomers";
import { Reservations } from "@/components/admin/customers/components/Reservations";
import { CustomerBehavior } from "@/services/admin/customers/types";
import { useCustomers } from "@/hooks/admin/customers/useCustomers";
import { Users, Package } from "lucide-react";

export default function CustomersPage() {
  const { customers, reservations, isLoadingCustomers, isLoadingReservations } =
    useCustomers();

  const handleViewCustomer = (customer: CustomerBehavior) => {
    // TODO: Implement customer detail view
    console.log("View customer:", customer);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gestión de Clientes
        </h1>
        <p className="text-muted-foreground">
          Análisis de comportamiento de clientes y gestión de reservas
        </p>
      </div>

      <Tabs defaultValue="frequent" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="frequent" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Clientes Frecuentes
          </TabsTrigger>
          <TabsTrigger value="reservations" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Reservas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="frequent" className="space-y-6">
          <FrequentCustomers
            customers={customers}
            isLoading={isLoadingCustomers}
            onViewCustomer={handleViewCustomer}
          />
        </TabsContent>

        <TabsContent value="reservations" className="space-y-6">
          <Reservations
            reservations={reservations}
            isLoading={isLoadingReservations}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
