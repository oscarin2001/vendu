"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { getBranchesByCompany } from "@/services/admin/branches/services/branch-service";
import { createManager } from "@/services/admin/managers/services/manager-service";
import { ManagerForm, ManagerFormData } from "../forms/ManagerForm";

interface CreateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  onSuccess: () => void;
}

export function CreateManagerModal({
  isOpen,
  onClose,
  tenantId,
  onSuccess,
}: CreateManagerModalProps) {
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadBranches();
    }
  }, [isOpen]);

  const loadBranches = async () => {
    try {
      setIsLoadingBranches(true);
      const data = await getBranchesByCompany(tenantId);
      setBranches(data);
    } catch (error) {
      console.error("Failed to load branches:", error);
    } finally {
      setIsLoadingBranches(false);
    }
  };

  const onSubmit = async (data: ManagerFormData) => {
    try {
      setIsLoading(true);
      await createManager(tenantId, {
        firstName: data.firstName,
        lastName: data.lastName,
        ci: data.ci,
        phone: data.phone,
        email: data.email,
        password: data.password!, // Required for create
        salary: data.salary,
        branchId: data.branchId ? parseInt(data.branchId) : undefined,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create manager:", error);
      alert(
        error instanceof Error ? error.message : "Failed to create manager"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Manager</DialogTitle>
          <DialogDescription>
            Add a new manager to your company. They will have access to manage
            their assigned branch.
          </DialogDescription>
        </DialogHeader>

        <ManagerForm
          branches={branches}
          isLoadingBranches={isLoadingBranches}
          onSubmit={onSubmit}
          submitButtonText="Create Manager"
          isSubmitting={isLoading}
          showPassword={true}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
