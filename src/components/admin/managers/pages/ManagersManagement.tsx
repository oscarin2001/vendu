"use client";

import { useState, useEffect } from "react";
import { ManagersList } from "../shared/components";

interface Manager {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  ci: string;
  phone: string | null;
  email: string;
  salary: number;
  hireDate: Date;
  branch: {
    id: number;
    name: string;
    isWarehouse: boolean;
  } | null;
  privilege: {
    name: string;
    code: string;
  };
}

async function getManagersByCompany(tenantId: string): Promise<Manager[]> {
  const response = await fetch(`/api/admin/managers?tenantId=${tenantId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch managers");
  }
  return response.json();
}

export function ManagersManagement() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    try {
      // TODO: Get tenantId from context/params
      const tenantId = "test-tenant"; // Mock for now
      const data = await getManagersByCompany(tenantId);
      setManagers(data);
    } catch (error) {
      console.error("Error loading managers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (managerId: string) => {
    // TODO: Implement edit functionality
    console.log("Edit manager:", managerId);
  };

  const handleDelete = (managerId: string) => {
    // TODO: Implement delete functionality
    console.log("Delete manager:", managerId);
  };

  if (loading) {
    return <div>Cargando encargados...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Encargados</h1>
        <p className="text-muted-foreground">
          Gestiona los encargados de tu empresa
        </p>
      </div>

      <ManagersList
        managers={managers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
