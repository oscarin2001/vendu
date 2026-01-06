"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CompanyMetrics } from "@/components/admin/company/metrics/CompanyMetrics";
import { CompanyOverview } from "@/components/admin/company/components/CompanyOverview";
import { CompanyDetailsModal } from "@/components/admin/company/modals/CompanyDetailsModal";
import { CompanyEditModal } from "@/components/admin/company/modals/CompanyEditModal";
import { useCompany } from "@/services/admin/company";

export function CompanyPageContent() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  // Custom hook for company logic
  const {
    company,
    subscription,
    metrics,
    isLoading,
    error,
    updateCompanyData,
  } = useCompany(tenantId);

  // Modal states
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Modal handlers
  const handleViewDetails = () => {
    setIsDetailsModalOpen(true);
  };

  const handleEditCompany = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data: any) => {
    try {
      await updateCompanyData(data);
      setIsEditModalOpen(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Empresa</h1>
          <p className="text-muted-foreground">
            Administra la información básica de tu empresa
          </p>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            Error al cargar los datos de la empresa
          </div>
          <div className="text-sm text-muted-foreground">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Gestión de Empresa</h1>
        <p className="text-muted-foreground">
          Administra la información básica de tu empresa y suscripción
        </p>
      </div>

      {/* Metrics */}
      <CompanyMetrics metrics={metrics} isLoading={isLoading} />

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CompanyOverview
            company={company}
            subscription={subscription}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
            onEdit={handleEditCompany}
          />
        </div>

        {/* Additional content can go here */}
        <div className="space-y-6">
          {/* Future: Quick actions, recent activity, etc. */}
        </div>
      </div>

      {/* Details Modal */}
      <CompanyDetailsModal
        company={company}
        subscription={subscription}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      {/* Edit Modal */}
      <CompanyEditModal
        company={company}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
