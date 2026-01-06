"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPin } from "lucide-react";
import { Branch } from "@/services/admin/branches";
import { BranchesTableSkeleton, BranchTableRow } from "./components";

interface BranchesTableProps {
  branches: Branch[];
  isLoading: boolean;
  onViewBranch: (branch: Branch) => void;
  onConfigureBranch: (branch: Branch) => void;
  onEditBranch: (branch: Branch) => void;
  onDeleteBranch: (branch: Branch) => void;
  onViewHistory?: (branch: Branch) => void;
}

export function BranchesTable({
  branches,
  isLoading,
  onViewBranch,
  onConfigureBranch,
  onEditBranch,
  onDeleteBranch,
  onViewHistory,
}: BranchesTableProps) {
  if (isLoading) {
    return <BranchesTableSkeleton />;
  }

  if (branches.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <div className="text-muted-foreground mb-4">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No hay sucursales</h3>
            <p>
              Crea tu primera sucursal para comenzar a gestionar tu negocio.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Gerente</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((branch) => (
            <BranchTableRow
              key={branch.id}
              branch={branch}
              onViewBranch={onViewBranch}
              onConfigureBranch={onConfigureBranch}
              onEditBranch={onEditBranch}
              onDeleteBranch={onDeleteBranch}
              onViewHistory={onViewHistory}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
