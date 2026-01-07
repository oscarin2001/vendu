"use client";

import { useState } from "react";
import { CustomerBehavior } from "@/services/admin/customers/types";

interface UseCustomerHandlersProps {
  refresh: () => void;
}

export function useCustomerHandlers({ refresh }: UseCustomerHandlersProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerBehavior | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleViewCustomer = (customer: CustomerBehavior) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModals = () => {
    setSelectedCustomer(null);
    setIsDetailsModalOpen(false);
  };

  return {
    selectedCustomer,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    handleViewCustomer,
    handleCloseModals
  };
}