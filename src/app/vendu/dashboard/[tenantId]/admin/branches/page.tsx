"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { BranchesList } from "@/components/admin/branches/lists/BranchesList";
import {
  getBranchesByCompany,
  deleteBranch,
} from "@/services/admin/branches/services/branch-service";

export default function BranchesPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBranches();
  }, [tenantId]);

  const loadBranches = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getBranchesByCompany(tenantId);
      setBranches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load branches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBranch = () => {
    alert("Create branch functionality coming soon");
  };

  const handleEditBranch = (branchId: string) => {
    alert(`Edit branch ${branchId} functionality coming soon`);
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (!confirm("Are you sure you want to delete this branch?")) {
      return;
    }

    try {
      await deleteBranch(parseInt(branchId));
      await loadBranches(); // Recargar la lista
      alert("Branch deleted successfully");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete branch");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Branches</h1>
          <p className="text-muted-foreground">Manage your company branches.</p>
        </div>
        <Button onClick={handleCreateBranch}>
          <Plus className="mr-2 h-4 w-4" />
          New Branch
        </Button>
      </div>

      <BranchesList
        branches={branches}
        onEdit={handleEditBranch}
        onDelete={handleDeleteBranch}
      />
    </div>
  );
}
