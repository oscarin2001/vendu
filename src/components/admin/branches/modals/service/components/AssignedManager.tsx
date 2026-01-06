"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { CheckCircle, User, X } from "lucide-react";

interface Manager {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isAssigned?: boolean;
}

interface AssignedManagerProps {
  manager: Manager | null;
  isAssigning: boolean;
  onRemove: () => void;
}

export function AssignedManager({
  manager,
  isAssigning,
  onRemove,
}: AssignedManagerProps) {
  if (!manager) return null;

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-600" />
        Gerente Asignado
      </h4>
      <div className="p-4 border rounded-lg bg-green-50 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-purple-100">
              <User className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {manager.firstName} {manager.lastName}
              </p>
              <p className="text-sm text-gray-600">{manager.email}</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Asignado
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            disabled={isAssigning}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" />
            Remover
          </Button>
        </div>
      </div>
    </div>
  );
}
