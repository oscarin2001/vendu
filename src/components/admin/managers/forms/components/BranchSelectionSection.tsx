"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building } from "lucide-react";

interface BranchSelectionSectionProps {
  branches: { id: number; name: string }[];
  selectedBranchIds: number[];
  errors: {
    branchIds?: string;
  };
  onChange: (branchIds: number[]) => void;
}

export function BranchSelectionSection({
  branches,
  selectedBranchIds,
  errors,
  onChange,
}: BranchSelectionSectionProps) {
  const handleBranchToggle = (branchId: number, checked: boolean) => {
    if (checked) {
      onChange([...selectedBranchIds, branchId]);
    } else {
      onChange(selectedBranchIds.filter((id) => id !== branchId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onChange(branches.map((b) => b.id));
    } else {
      onChange([]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Sucursales Asignadas</h3>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Seleccionar Sucursales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="selectAll"
              checked={selectedBranchIds.length === branches.length}
              onCheckedChange={handleSelectAll}
            />
            <Label htmlFor="selectAll" className="font-medium">
              Seleccionar todas las sucursales
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {branches.map((branch) => (
              <div key={branch.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`branch-${branch.id}`}
                  checked={selectedBranchIds.includes(branch.id)}
                  onCheckedChange={(checked) =>
                    handleBranchToggle(branch.id, checked as boolean)
                  }
                />
                <Label htmlFor={`branch-${branch.id}`} className="flex-1">
                  {branch.name}
                </Label>
              </div>
            ))}
          </div>

          {selectedBranchIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm font-medium">Seleccionadas:</span>
              {selectedBranchIds.map((id) => {
                const branch = branches.find((b) => b.id === id);
                return branch ? (
                  <Badge key={id} variant="secondary">
                    {branch.name}
                  </Badge>
                ) : null;
              })}
            </div>
          )}

          {errors.branchIds && (
            <p className="text-sm text-red-500">{errors.branchIds}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
