"use client";

export function AdminOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard de Administración</h1>
        <p className="text-muted-foreground">
          Bienvenido al panel de administración de tu organización.
        </p>
      </div>

      {/* Aquí irán métricas y componentes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Usuarios</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Sucursales</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Ventas</h3>
          <p className="text-2xl font-bold">$0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Inventario</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
