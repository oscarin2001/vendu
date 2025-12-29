"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { ManagersList } from "@/components/admin/managers/lists/ManagersList";
import { CreateManagerModal } from "@/components/admin/managers/modals/CreateManagerModal";
import { EditManagerModal } from "@/components/admin/managers/modals/EditManagerModal";
import {
  getManagersByCompany,
  deleteManager,
} from "@/services/admin/managers/services/manager-service";

export default function ManagersPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const [managers, setManagers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingManagerId, setEditingManagerId] = useState<number | null>(null);

  useEffect(() => {
    loadManagers();
  }, [tenantId]);

  const loadManagers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getManagersByCompany(tenantId);
      setManagers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load managers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateManager = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditManager = (managerId: string) => {
    setEditingManagerId(parseInt(managerId));
    setIsEditModalOpen(true);
  };

  const handleDeleteManager = async (managerId: string) => {
    if (!confirm("Are you sure you want to delete this manager?")) {
      return;
    }

    try {
      await deleteManager(parseInt(managerId));
      await loadManagers(); // Recargar la lista
      alert("Manager deleted successfully");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete manager");
    }
  };

  const handleManagerCreated = () => {
    loadManagers(); // Recargar la lista después de crear
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
          <h1 className="text-3xl font-bold">Managers</h1>
          <p className="text-muted-foreground">Manage your company managers.</p>
        </div>
        <Button onClick={handleCreateManager}>
          <Plus className="mr-2 h-4 w-4" />
          New Manager
        </Button>
      </div>

      <ManagersList
        managers={managers}
        onEdit={handleEditManager}
        onDelete={handleDeleteManager}
      />

      <CreateManagerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        tenantId={tenantId}
        onSuccess={handleManagerCreated}
      />

      <EditManagerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingManagerId(null);
        }}
        tenantId={tenantId}
        managerId={editingManagerId}
        onSuccess={handleManagerCreated}
      />
    </div>
  );
}
