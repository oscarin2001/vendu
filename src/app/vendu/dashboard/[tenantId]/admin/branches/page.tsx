"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { BranchesList } from "@/components/admin/branches/lists/BranchesList";
import { BranchForm } from "@/components/admin/branches/forms/BranchForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getBranchesByCompany,
  createBranch,
  updateBranch,
  deleteBranch,
} from "@/services/admin/branches/services/branch-service";
import { getManagersByCompany } from "@/services/admin/managers/services/manager-service";

interface Branch {
  id: number;
  name: string;
  isWarehouse: boolean;
  phone: string | null;
  address: string;
  city: string;
  department: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  openingHours: any;
  manager: {
    id: number;
    name: string;
    email: string;
  } | null;
  createdAt: Date;
}

export default function BranchesPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const [branches, setBranches] = useState<Branch[]>([]);
  const [managers, setManagers] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [branchesData, managersData] = await Promise.all([
        getBranchesByCompany(tenantId),
        getManagersByCompany(tenantId),
      ]);
      setBranches(branchesData);
      setManagers(managersData.map((m: any) => ({ id: m.id, name: m.fullName })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBranch = async (data: any) => {
    try {
      await createBranch(tenantId, data);
      await loadData();
      setIsCreateModalOpen(false);
      toast.success("Sucursal creada exitosamente");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear sucursal");
    }
  };

  const handleEditBranch = async (data: any) => {
    if (!editingBranch) return;
    try {
      await updateBranch(editingBranch.id, data);
      await loadData();
      setEditingBranch(null);
      toast.success("Sucursal actualizada exitosamente");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al actualizar sucursal");
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta sucursal?")) {
      return;
    }
    try {
      await deleteBranch(parseInt(branchId));
      await loadData();
      toast.success("Sucursal eliminada exitosamente");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar sucursal");
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sucursales</h1>
          <p className="text-muted-foreground">
            Gestiona tus sucursales y bodegas.
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Sucursal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Sucursal</DialogTitle>
            </DialogHeader>
            <BranchForm
              managers={managers}
              onSubmit={handleCreateBranch}
              mode="create"
            />
          </DialogContent>
        </Dialog>
      </div>

      <BranchesList
        branches={branches}
        onEdit={(branchId) => {
          const branch = branches.find(b => b.id.toString() === branchId);
          if (branch) setEditingBranch(branch);
        }}
        onDelete={handleDeleteBranch}
      />

      <Dialog open={!!editingBranch} onOpenChange={(open) => !open && setEditingBranch(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Sucursal</DialogTitle>
          </DialogHeader>
          {editingBranch && (
            <BranchForm
              initialData={{
                name: editingBranch.name,
                isWarehouse: editingBranch.isWarehouse,
                phone: editingBranch.phone || "",
                address: editingBranch.address,
                city: editingBranch.city,
                department: editingBranch.department || "",
                country: editingBranch.country || "",
                managerId: editingBranch.manager?.id,
              }}
              managers={managers}
              onSubmit={handleEditBranch}
              mode="edit"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
