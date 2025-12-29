"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Mail, Phone, Building, UserCheck } from "lucide-react";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  ci: string;
  phone: string | null;
  email: string;
  salary: number;
  hireDate: Date;
  contractType: string;
  branch: {
    id: number;
    name: string;
    isWarehouse: boolean;
  } | null;
  privilege: {
    name: string;
    code: string;
  };
  isActive: boolean;
}

interface EmployeesListProps {
  employees: Employee[];
  onEdit: (employeeId: string) => void;
  onDelete: (employeeId: string) => void;
}

export function EmployeesList({
  employees,
  onEdit,
  onDelete,
}: EmployeesListProps) {
  if (employees.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium">No employees</h3>
            <p className="text-muted-foreground">
              Create your first employee to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {employees.map((employee) => (
        <Card key={employee.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{employee.fullName}</CardTitle>
              <Badge variant={employee.isActive ? "default" : "secondary"}>
                {employee.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{employee.email}</span>
            </div>

            {employee.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.phone}</span>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{employee.privilege.name}</span>
            </div>

            {employee.branch && (
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.branch.name}</span>
              </div>
            )}

            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(employee.id.toString())}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(employee.id.toString())}
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
