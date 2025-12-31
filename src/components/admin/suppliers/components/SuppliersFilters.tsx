"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Truck } from "lucide-react";
import { SupplierFiltersState } from "@/services/admin/suppliers/types/supplier.types";

interface SuppliersFiltersProps {
  filters: SupplierFiltersState;
  onFiltersChange: (filters: SupplierFiltersState) => void;
  managers: { id: number; name: string }[];
  onCreateSupplier: () => void;
}

export function SuppliersFilters({
  filters,
  onFiltersChange,
  managers,
  onCreateSupplier,
}: SuppliersFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleManagerChange = (value: string) => {
    onFiltersChange({
      ...filters,
      managerId: value === "all" ? undefined : parseInt(value),
    });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value as "all" | "active" | "inactive",
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: "all",
      managerId: undefined,
    });
  };

  const hasActiveFilters =
    filters.search || filters.managerId || filters.status !== "all";

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar proveedores..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Manager Filter */}
        <Select
          value={filters.managerId?.toString() || "all"}
          onValueChange={handleManagerChange}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todos los encargados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los encargados</SelectItem>
            {managers.map((manager) => (
              <SelectItem key={manager.id} value={manager.id.toString()}>
                {manager.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Create Button */}
      <Button onClick={onCreateSupplier}>
        <Truck className="h-4 w-4 mr-2" />
        Nuevo Proveedor
      </Button>
    </div>
  );
}
