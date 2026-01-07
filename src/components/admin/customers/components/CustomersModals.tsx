"use client";

import { CustomerDetailsModal } from "./modals/CustomerDetailsModal";
import { CustomerBehavior } from "@/services/admin/customers/types";

interface CustomersModalsProps {
  selectedCustomer: CustomerBehavior | null;
  isDetailsModalOpen: boolean;
  onDetailsModalChange: (open: boolean) => void;
  onCloseModals: () => void;
}

export function CustomersModals({
  selectedCustomer,
  isDetailsModalOpen,
  onDetailsModalChange,
  onCloseModals
}: CustomersModalsProps) {
  return (
    <>
      <CustomerDetailsModal
        customer={selectedCustomer}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          onDetailsModalChange(false);
          onCloseModals();
        }}
      />
    </>
  );
}