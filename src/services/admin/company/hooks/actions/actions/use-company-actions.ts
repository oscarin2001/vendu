"use client";

import { updateCompany } from "@/services/admin/company/services";
import { toast } from "sonner";

export function useCompanyActions(tenantId: string, reloadData: () => void) {
  const updateCompanyData = async (data: any) => {
    try {
      await updateCompany(tenantId, data);
      await reloadData(); // Reload data
      toast.success("Empresa actualizada exitosamente");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar la empresa";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    updateCompanyData,
  };
}
