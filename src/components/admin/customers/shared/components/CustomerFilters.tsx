"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { CustomerFiltersProps } from "../types";

export function CustomerFilters({ filters, onFiltersChange, onClearFilters }: CustomerFiltersProps) {
  const handleSegmentChange = (segment: string) => {
    onFiltersChange({
      ...filters,
      segment: segment as 'all' | 'loyal' | 'new' | 'inactive'
    });
  };

  const handleLoyaltyTierChange = (loyaltyTier: string) => {
    onFiltersChange({
      ...filters,
      loyaltyTier: loyaltyTier as 'all' | 'platinum' | 'gold' | 'silver' | 'bronze'
    });
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({
      ...filters,
      search
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar clientes..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Select value={filters.segment} onValueChange={handleSegmentChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Segmento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="loyal">Leales</SelectItem>
          <SelectItem value="new">Nuevos</SelectItem>
          <SelectItem value="inactive">Inactivos</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.loyaltyTier} onValueChange={handleLoyaltyTierChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Nivel de lealtad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="platinum">Platino</SelectItem>
          <SelectItem value="gold">Oro</SelectItem>
          <SelectItem value="silver">Plata</SelectItem>
          <SelectItem value="bronze">Bronce</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={onClearFilters} className="shrink-0">
        <X className="h-4 w-4 mr-2" />
        Limpiar
      </Button>
    </div>
  );
}