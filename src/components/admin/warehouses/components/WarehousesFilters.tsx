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
import { Search, Plus } from "lucide-react";

interface WarehousesFiltersProps {
  filters: {
    search: string;
    status: "all" | "withManager" | "withoutManager";
  };
  onFiltersChange: (filters: {
    search: string;
    status: "all" | "withManager" | "withoutManager";
  }) => void;
  onCreateWarehouse: () => void;
}

export function WarehousesFilters({
  filters,
  onFiltersChange,
  onCreateWarehouse,
}: WarehousesFiltersProps) {
  const updateFilter = (key: keyof typeof filters, value: any) => {
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
            placeholder="Buscar bodegas..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <div suppressHydrationWarning>
          <Select
            value={filters.status}
            onValueChange={(value) => updateFilter("status", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las bodegas</SelectItem>
              <SelectItem value="withManager">Con gerente</SelectItem>
              <SelectItem value="withoutManager">Sin gerente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Create Button */}
      <Button onClick={onCreateWarehouse} className="shrink-0">
        <Plus className="h-4 w-4 mr-2" />
        Nueva Bodega
      </Button>
    </div>
  );
}
