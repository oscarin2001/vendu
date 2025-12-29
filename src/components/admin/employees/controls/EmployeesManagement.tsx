"use client";

import { useState, useEffect } from "react";
import { EmployeesList } from "../lists/EmployeesList";

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

export function EmployeesManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      // TODO: Get tenantId from context/params and implement employee service
      // const tenantId = "test-tenant"; // Mock for now
      // const data = await getEmployeesByCompany(tenantId);
      // setEmployees(data);
      setEmployees([]); // Mock empty for now
    } catch (error) {
      console.error("Error loading employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employeeId: string) => {
    // TODO: Implement edit functionality
    console.log("Edit employee:", employeeId);
  };

  const handleDelete = (employeeId: string) => {
    // TODO: Implement delete functionality
    console.log("Delete employee:", employeeId);
  };

  if (loading) {
    return <div>Cargando empleados...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Empleados</h1>
        <p className="text-muted-foreground">
          Gestiona los empleados de tu empresa
        </p>
      </div>

      <EmployeesList
        employees={employees}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
