"use client";

import { UserListTable } from "@/components/admin/user-management/UserListTable";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <p className="text-muted-foreground">
          Administra los usuarios de tu organización.
        </p>
      </div>
      <UserListTable />
    </div>
  );
}