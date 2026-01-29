"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { 
  Briefcase, 
  Building2, 
  Package, 
  TrendingUp,
  LogOut 
} from "lucide-react";

interface ManagerDashboardContentProps {
  tenantId: string;
  managerName: string;
}

export function ManagerDashboardContent({ 
  tenantId, 
  managerName 
}: ManagerDashboardContentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <ManagerHeader managerName={managerName} />
      <main className="container mx-auto px-4 py-8">
        <ManagerWelcomeCard managerName={managerName} />
        <ManagerQuickStats />
        <ManagerQuickActions />
      </main>
    </div>
  );
}

function ManagerHeader({ managerName }: { managerName: string }) {
  return (
    <header className="bg-emerald-900 text-white py-4 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Briefcase className="h-6 w-6" />
          <span className="font-semibold text-lg">Portal de Gestión</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-emerald-200">Hola, {managerName}</span>
          <form action="/api/manager/logout" method="POST">
            <Button variant="ghost" size="sm" className="text-white hover:bg-emerald-800">
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}

function ManagerWelcomeCard({ managerName }: { managerName: string }) {
  return (
    <Card className="mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0">
      <CardContent className="py-6">
        <h1 className="text-2xl font-bold">Bienvenido, {managerName}</h1>
        <p className="text-emerald-100 mt-2">
          Gestiona tus sucursales y operaciones desde este panel
        </p>
      </CardContent>
    </Card>
  );
}

function ManagerQuickStats() {
  const stats = [
    { label: "Sucursales Asignadas", value: "3", icon: Building2 },
    { label: "Productos en Stock", value: "1,234", icon: Package },
    { label: "Ventas del Mes", value: "$45,678", icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <stat.icon className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ManagerQuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionButton icon={Building2} label="Ver Sucursales" />
        <QuickActionButton icon={Package} label="Inventario" />
        <QuickActionButton icon={TrendingUp} label="Reportes" />
        <QuickActionButton icon={Briefcase} label="Mi Perfil" />
      </CardContent>
    </Card>
  );
}

interface QuickActionButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

function QuickActionButton({ icon: Icon, label }: QuickActionButtonProps) {
  return (
    <Button 
      variant="outline" 
      className="h-24 flex-col gap-2 hover:bg-emerald-50 hover:border-emerald-300"
    >
      <Icon className="h-6 w-6 text-emerald-600" />
      <span className="text-sm">{label}</span>
    </Button>
  );
}
