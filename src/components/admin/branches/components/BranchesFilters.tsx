"use client";

import { useId } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Filter } from "lucide-react";
import { BranchFiltersState } from "@/services/admin/branches/types/branch.types";

interface BranchesFiltersProps {
  filters: BranchFiltersState;
  onFiltersChange: (filters: BranchFiltersState) => void;
  onCreateBranch: () => void;
}

export function BranchesFilters({
  filters,
  onFiltersChange,
  onCreateBranch,
}: BranchesFiltersProps) {
  const updateFilter = (key: keyof BranchFiltersState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar sucursales..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Type Filter */}
        <div suppressHydrationWarning>
          <Select
            value={filters.type}
            onValueChange={(value: any) => updateFilter("type", value)}
          >
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="stores">Tiendas</SelectItem>
              <SelectItem value="warehouses">Bodegas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(value: any) => updateFilter("status", value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activas</SelectItem>
            <SelectItem value="inactive">Inactivas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Create Button */}
      <Button onClick={onCreateBranch} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Agregar Sucursal
      </Button>
    </div>
  );
}
