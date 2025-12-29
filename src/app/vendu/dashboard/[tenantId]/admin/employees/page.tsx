"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { EmployeesList } from "@/components/admin/employees/lists/EmployeesList";
import { getEmployeesByCompany } from "@/services/admin/employees/services/employee-service";

export default function EmployeesPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
  }, [tenantId]);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getEmployeesByCompany(tenantId);
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load employees");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEmployee = () => {
    alert("Create employee functionality coming soon");
  };

  const handleEditEmployee = (employeeId: string) => {
    alert(`Edit employee ${employeeId} functionality coming soon`);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    alert(`Delete employee ${employeeId} functionality coming soon`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-muted-foreground">
            Manage your company employees.
          </p>
        </div>
        <Button onClick={handleCreateEmployee}>
          <Plus className="mr-2 h-4 w-4" />
          New Employee
        </Button>
      </div>

      <EmployeesList
        employees={employees}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployee}
      />
    </div>
  );
}
