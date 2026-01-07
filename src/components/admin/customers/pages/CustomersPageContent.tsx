"use client";

import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomersMetricsGrid } from "../metrics/CustomersMetricsGrid";
import { CustomerFilters } from "../shared/components/CustomerFilters";
import {
  CustomerBehaviorTable,
  CustomerSegmentsTable,
  ReservationsTable,
} from "../tables";
import { CustomersModals } from "../components/CustomersModals";
import { useCustomers } from "@/services/admin/customers/hooks/main";
import { useCustomerHandlers } from "../hooks/useCustomerHandlers";

export function CustomersPageContent() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  // Custom hook for customers logic
  const {
    customerBehaviors,
    metrics,
    segments,
    reservations,
    filters,
    isLoading,
    updateFilters,
    clearFilters,
    refetch,
  } = useCustomers(tenantId);

  // Custom hook for modal handlers
  const {
    selectedCustomer,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    handleViewCustomer,
    handleCloseModals,
  } = useCustomerHandlers({ refresh: refetch });

  // Wrapper function for filters change
  const handleFiltersChange = (newFilters: {
    segment: "all" | "loyal" | "new" | "inactive";
    search: string;
    loyaltyTier: "all" | "platinum" | "gold" | "silver" | "bronze";
  }) => {
    updateFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground">
          Análisis completo del comportamiento y segmentación de clientes
        </p>
      </div>

      {/* Metrics */}
      <CustomersMetricsGrid metrics={metrics} isLoading={isLoading} />

      {/* Filters */}
      <CustomerFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={clearFilters}
      />

      {/* Tabs Content */}
      <Tabs defaultValue="behavior" className="space-y-4">
        <TabsList>
          <TabsTrigger value="behavior">Comportamiento</TabsTrigger>
          <TabsTrigger value="segments">Segmentos</TabsTrigger>
          <TabsTrigger value="reservations">Reservas</TabsTrigger>
          <TabsTrigger value="loyalty">Programa de Lealtad</TabsTrigger>
        </TabsList>

        <TabsContent value="behavior" className="space-y-4">
          <CustomerBehaviorTable
            customers={customerBehaviors}
            isLoading={isLoading}
            onViewCustomer={handleViewCustomer}
          />
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <CustomerSegmentsTable segments={segments} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="reservations" className="space-y-4">
          <ReservationsTable
            reservations={reservations}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Loyalty Program Overview */}
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Programa de Lealtad
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Bronce (0-99 puntos)</span>
                  <span className="text-sm text-muted-foreground">
                    1x puntos
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Plata (100-499 puntos)</span>
                  <span className="text-sm text-muted-foreground">
                    1.5x puntos
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Oro (500-999 puntos)</span>
                  <span className="text-sm text-muted-foreground">
                    2x puntos
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platino (1000+ puntos)</span>
                  <span className="text-sm text-muted-foreground">
                    3x puntos
                  </span>
                </div>
              </div>
            </div>

            {/* Top Customers by Points */}
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Top Clientes por Puntos
              </h3>
              <div className="space-y-3">
                {customerBehaviors
                  .sort((a, b) => b.pointsBalance - a.pointsBalance)
                  .slice(0, 5)
                  .map((customer, index) => (
                    <div
                      key={customer.id}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm">
                        #{index + 1} {customer.customerId}
                      </span>
                      <span className="font-medium">
                        {customer.pointsBalance} pts
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CustomersModals
        selectedCustomer={selectedCustomer}
        isDetailsModalOpen={isDetailsModalOpen}
        onDetailsModalChange={setIsDetailsModalOpen}
        onCloseModals={handleCloseModals}
      />
    </div>
  );
}
