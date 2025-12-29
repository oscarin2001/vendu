"use client";

import { useState, useEffect } from "react";
import { BranchesList } from "../lists/BranchesList";

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

async function getBranchesByCompany(tenantId: string): Promise<Branch[]> {
  const response = await fetch(`/api/admin/branches?tenantId=${tenantId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch branches");
  }
  return response.json();
}

export function BranchesManagement() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      // TODO: Get tenantId from context/params
      const tenantId = "test-tenant"; // Mock for now
      const data = await getBranchesByCompany(tenantId);
      setBranches(data);
    } catch (error) {
      console.error("Error loading branches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (branchId: string) => {
    // TODO: Implement edit functionality
    console.log("Edit branch:", branchId);
  };

  const handleDelete = (branchId: string) => {
    // TODO: Implement delete functionality
    console.log("Delete branch:", branchId);
  };

  if (loading) {
    return <div>Cargando sucursales...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sucursales</h1>
        <p className="text-muted-foreground">
          Gestiona las sucursales de tu empresa
        </p>
      </div>

      <BranchesList
        branches={branches}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
