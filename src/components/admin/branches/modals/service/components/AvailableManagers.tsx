"use client";

import { Button } from "@/components/ui/Button";
import { AlertCircle, Plus, User } from "lucide-react";

interface Manager {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isAssigned?: boolean;
}

interface AvailableManagersProps {
  managers: Manager[];
  isAssigning: boolean;
  onAssign: (managerId: number) => void;
}

export function AvailableManagers({
  managers,
  isAssigning,
  onAssign,
}: AvailableManagersProps) {
  if (managers.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        Gerentes Disponibles
      </h4>
      <div className="grid gap-3">
        {managers.map((manager) => (
          <div
            key={manager.id}
            className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">
                  {manager.firstName} {manager.lastName}
                </p>
                <p className="text-sm text-gray-600">{manager.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAssign(manager.id)}
              disabled={isAssigning}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Asignar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
