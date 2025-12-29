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
import {
  getManagerById,
  updateManager,
} from "@/services/admin/managers/services/manager-service";
import { ManagerForm, ManagerFormData } from "../forms/ManagerForm";

interface EditManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  managerId: number | null;
  onSuccess: () => void;
}

export function EditManagerModal({
  isOpen,
  onClose,
  tenantId,
  managerId,
  onSuccess,
}: EditManagerModalProps) {
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [isLoadingManager, setIsLoadingManager] = useState(false);
  const [managerData, setManagerData] = useState<Partial<ManagerFormData>>({});

  useEffect(() => {
    if (isOpen) {
      loadBranches();
      if (managerId) {
        loadManagerData(managerId);
      }
    }
  }, [isOpen, managerId]);

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

  const loadManagerData = async (id: number) => {
    try {
      setIsLoadingManager(true);
      const manager = await getManagerById(id);
      if (manager) {
        setManagerData({
          firstName: manager.firstName,
          lastName: manager.lastName,
          ci: manager.ci,
          phone: manager.phone || "",
          email: manager.email,
          salary: manager.salary.toNumber(),
          branchId: manager.branch?.id.toString() || "",
        });
      }
    } catch (error) {
      console.error("Failed to load manager:", error);
    } finally {
      setIsLoadingManager(false);
    }
  };

  const onSubmit = async (data: ManagerFormData) => {
    if (!managerId) return;

    try {
      setIsLoading(true);
      await updateManager(managerId, {
        ...data,
        branchId: data.branchId ? parseInt(data.branchId) : undefined,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update manager:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update manager"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setManagerData({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Manager</DialogTitle>
          <DialogDescription>
            Update manager information and branch assignment.
          </DialogDescription>
        </DialogHeader>

        {isLoadingManager ? (
          <div className="flex justify-center py-8">
            <div>Loading manager data...</div>
          </div>
        ) : (
          <ManagerForm
            initialData={managerData}
            branches={branches}
            isLoadingBranches={isLoadingBranches}
            onSubmit={onSubmit}
            submitButtonText="Update Manager"
            isSubmitting={isLoading}
            showPassword={false}
          />
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
