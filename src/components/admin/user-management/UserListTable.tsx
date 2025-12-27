"use client";

export function UserListTable() {
  return (
    <div className="rounded-lg border">
      <div className="p-4">
        <h3 className="font-semibold">Lista de Usuarios</h3>
        <p className="text-sm text-muted-foreground">
          Aquí se mostrará la tabla de usuarios.
        </p>
        {/* TODO: Implementar tabla con datos reales */}
        <div className="mt-4">
          <p>No hay usuarios registrados aún.</p>
        </div>
      </div>
    </div>
  );
}