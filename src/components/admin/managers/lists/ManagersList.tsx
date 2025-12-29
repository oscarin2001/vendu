"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Mail, Phone, Building, UserCheck } from "lucide-react";

interface Manager {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  ci: string;
  phone: string | null;
  email: string;
  salary: number;
  hireDate: Date;
  branch: {
    id: number;
    name: string;
    isWarehouse: boolean;
  } | null;
  privilege: {
    name: string;
    code: string;
  };
}

interface ManagersListProps {
  managers: Manager[];
  onEdit: (managerId: string) => void;
  onDelete: (managerId: string) => void;
}

export function ManagersList({
  managers,
  onEdit,
  onDelete,
}: ManagersListProps) {
  if (managers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium">No managers</h3>
            <p className="text-muted-foreground">
              Create your first manager to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {managers.map((manager) => (
        <Card key={manager.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{manager.fullName}</CardTitle>
              <Badge variant="default">{manager.privilege.name}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{manager.email}</span>
            </div>

            {manager.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{manager.phone}</span>
              </div>
            )}

            {manager.branch && (
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{manager.branch.name}</span>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Salary: ${manager.salary}</span>
            </div>

            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(manager.id.toString())}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(manager.id.toString())}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
