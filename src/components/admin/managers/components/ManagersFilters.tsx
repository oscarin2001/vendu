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
import { Search, X } from "lucide-react";
import { ManagerFilters } from "@/services/admin/managers/types/manager.types";

interface ManagersFiltersProps {
  filters: ManagerFilters;
  onFiltersChange: (filters: ManagerFilters) => void;
  branches: { id: number; name: string }[];
}

export function ManagersFilters({
  filters,
  onFiltersChange,
  branches,
}: ManagersFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleBranchChange = (value: string) => {
    onFiltersChange({ ...filters, branch: value });
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
      branch: "all",
      status: "all",
    });
  };

  const hasActiveFilters =
    filters.search || filters.branch !== "all" || filters.status !== "all";

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar encargados..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Branch Filter */}
        <Select value={filters.branch} onValueChange={handleBranchChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Todas las sucursales" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las sucursales</SelectItem>
            <SelectItem value="none">Sin sucursal</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id.toString()}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
